import { HttpStatus } from "../constants/HttpStatus";
import { RegisterStudent } from "../dto/RegisterStudent.dto";
import db from "../models";
import { Student } from "../models/student.model";
import { Teacher } from "../models/teacher.model";
import { CustomError } from "../util/CustomError"

export default class TeacherService {
    static registerStudent = async (body: RegisterStudent) => {
        const { teacher, students } = body;

        if (!teacher || !students || students.length === 0) {
            throw new CustomError(HttpStatus.BAD_REQUEST, 'Invalid request, missing teacher or students')
        }

        // find the teacher by email
        const teacherRecord = await db.Teacher.findOne({ where: { email: teacher } });
        if (!teacherRecord) {
            throw new CustomError(HttpStatus.NOT_FOUND, "Teacher not found!")
        }

        // Find students by their emails
        const studentRecords = await db.Student.findAll({
            where: {
                email: students,
            },
        });

        const foundStudentEmails = studentRecords.map((student: Partial<Student>) => student.email);
        const missingStudents = students.filter((studentEmail: string) => !foundStudentEmails.includes(studentEmail));

        // ensure all students are found
        if (studentRecords.length !== students.length) {
            throw new CustomError(HttpStatus.BAD_REQUEST, `Students not found: ${missingStudents.join(', ')}`)
        }

        // Associate the teacher with the students
        const teacherStudentAssociations = studentRecords.map((student: Partial<Student>) => ({
            teacherId: teacherRecord.id,
            studentId: student.id,
        }));

        // Bulk create associations in teacher-student table
        await db.TeacherStudent.bulkCreate(teacherStudentAssociations);
    }

    static getCommonStudents = async (query: any) => {
        //convert query to list
        let { teacher } = query;
        teacher = Array.isArray(teacher) ? teacher : [teacher];

        if (!teacher || !Array.isArray(teacher) || teacher.length === 0) {
            throw new CustomError(HttpStatus.BAD_REQUEST, `At least one teacher must be provided`)
        }

        //find all teachers with their student
        const teachersWithStudents = await db.Teacher.findAll({
            where: {
                email: teacher,
            },
            include: [
                {
                    model: Student,
                    attributes: ['id', 'email'],
                    through: { attributes: [] },
                },
            ],
        });

        // Find missing teachers
        const foundTeacherEmails = teachersWithStudents.map((teacher: Partial<Teacher>) => teacher.email);
        const missingTeachers = teacher.filter(
            (email: string) => !foundTeacherEmails.includes(email)
        );

        if (missingTeachers.length > 0) {
            throw new CustomError(HttpStatus.BAD_REQUEST, `One or more teachers not found: ${missingTeachers}`)
        }

        //extract and intersect student IDs
        const studentIdSets = teachersWithStudents.map((teacher: any) =>
            new Set(teacher.Students.map((student: Partial<Student>) => student.id))
        );

        //get common student id
        const commonStudentIds = Array.from(
            studentIdSets.reduce((commonSet: any, studentSet: any) => {
                if (commonSet.size === 0) return studentSet; // initialize with the first teacher's students
                return new Set([...commonSet].filter((id) => studentSet.has(id))); // intersect the sets
            }, new Set<number>())
        );

        // retrieve student details for the common student IDs
        const commonStudents = await db.Student.findAll({
            where: {
                id: commonStudentIds,
            },
            attributes: ['email'], //only retrieve email
        });

        return { students: commonStudents ? commonStudents.map((s: Partial<Student>) => s.email) : [] };
    }
}
