import { HttpStatus } from "../constants/HttpStatus";
import { RegisterStudent } from "../dto/RegisterStudent.dto";
import db from "../models";
import { Student } from "../models/student.model";
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
}
