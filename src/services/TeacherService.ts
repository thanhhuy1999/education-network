import Joi from "joi";
import { HttpStatus } from "../constants/HttpStatus";
import { CommonStudentReq, CommonStudentRes, getCommonStudentsSchema } from "../dtos/CommonStudent.dto";
import { RegisterStudent, registerStudentSchema } from "../dtos/RegisterStudent.dto";
import { RetrieveForNotification, RetrieveForNotificationRes, retrieveForNotificationsSchema } from "../dtos/RetrieveForNotification.dto";
import { SuspendStudent, suspendStudentSchema } from "../dtos/SuspendStudent.dto";
import db from "../models";
import { Student } from "../models/StudentModel";
import { Teacher } from "../models/TeacherModel";
import { TeacherStudent } from "../models/TeacherStudentModel";
import { CustomError } from "../utils/CustomError"
import { Op } from "sequelize";
import { StudentDTO, TeacherDTO, TeacherStudentRes, TeacherWithStudents } from "../dtos/TeacherWithStudents.dto";

export default class TeacherService {
    static registerStudent = async (body: RegisterStudent): Promise<void> => {
        //validate input
        const { error, value } = registerStudentSchema.validate(body);

        if (error) {
            throw new CustomError(HttpStatus.BAD_REQUEST, error.details[0].message)
        }

        const { teacher, students } = value;

        // find the teacher by email
        const teacherRecord: Teacher | null = await db.Teacher.findOne({ where: { email: teacher } });
        if (!teacherRecord) {
            throw new CustomError(HttpStatus.NOT_FOUND, "Teacher not found!")
        }

        // Find students by their emails
        const studentRecords: Student[] = await db.Student.findAll({
            where: {
                email: students,
            },
        });

        const foundStudentEmails: (string | undefined)[] = studentRecords.map((student: Student) => student.email);
        const missingStudents: string[] = students.filter((studentEmail: string) => !foundStudentEmails.includes(studentEmail));

        // ensure all students are found
        if (studentRecords.length !== students.length) {
            throw new CustomError(HttpStatus.BAD_REQUEST, `Students not found: ${missingStudents.join(', ')}`)
        }

        // check existing associations in the TeacherStudent table
        const existingAssociations: TeacherStudent[] = await db.TeacherStudent.findAll({
            where: {
                teacherId: teacherRecord.id,
                studentId: studentRecords.map((student: Student) => student.id),
            },
        });

        const existingStudentIds: Set<number | undefined> = new Set(
            existingAssociations.map((association: TeacherStudent) => association.studentId)
        );

        // filter out existing associations
        const newAssociations = studentRecords
            .filter((student: Student) => !existingStudentIds.has(student.id))
            .map((student: Student) => ({
                teacherId: teacherRecord.id,
                studentId: student.id,
            }));

        // all associations already existed => return (or throw error) base on bussiness
        if (newAssociations.length === 0) {
            return;
        }

        // bulk create associations in teacher-student table
        await db.TeacherStudent.bulkCreate(newAssociations);
    }

    static getCommonStudents = async (query: CommonStudentReq): Promise<CommonStudentRes> => {
        const { error, value } = getCommonStudentsSchema.validate(query);

        if (error) {
            throw new CustomError(HttpStatus.BAD_REQUEST, error.details[0].message);
        }

        //change to array list
        let { teacher } = value;
        teacher = Array.isArray(teacher) ? teacher : [teacher];

        //find all teachers with their student
        const teachersWithStudents: TeacherWithStudents[] = await db.Teacher.findAll({
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
        const foundTeacherEmails: (string | undefined)[] = teachersWithStudents.map((teacher: TeacherDTO) => teacher.email);
        const missingTeachers: (string | undefined)[] = teacher.filter(
            (email: string) => !foundTeacherEmails.includes(email)
        );

        if (missingTeachers.length > 0) {
            throw new CustomError(HttpStatus.BAD_REQUEST, `One or more teachers not found: ${missingTeachers}`)
        }

        //extract and intersect student IDs
        const studentIdSets = teachersWithStudents.map((teacher: TeacherWithStudents) =>
            new Set(teacher?.Students?.map((student: StudentDTO) => student.id))
        );

        //get common student id
        const commonStudentIds: (number | undefined)[] = Array.from(
            studentIdSets.reduce((commonSet: Set<number | undefined>, studentSet: Set<number | undefined>) => {
                if (commonSet.size === 0) return studentSet; // initialize with the first teacher's students
                return new Set([...commonSet].filter((id) => studentSet.has(id))); // intersect the sets
            }, new Set<number>())
        );

        // retrieve student details for the common student IDs
        const commonStudents: Student[] = await db.Student.findAll({
            where: {
                id: commonStudentIds,
            },
            attributes: ['email'], //only retrieve email
        });

        return {
            students: !!commonStudents
                ? commonStudents
                    .map((s: Student) => s.email)
                    .filter((email: string | undefined) => email !== undefined)
                : [],
        };
    }

    static suspendStudent = async (body: SuspendStudent): Promise<void> => {
        //validate input
        const { error, value } = suspendStudentSchema.validate(body)

        if (error) {
            throw new CustomError(HttpStatus.BAD_REQUEST, error.details[0].message)
        }

        const { student } = value;

        const studentRecord: Student | null = await db.Student.findOne({ where: { email: student } });

        // if the student does not exist, return an error
        if (!studentRecord) {
            throw new CustomError(HttpStatus.NOT_FOUND, `Student with email ${student} not found`);
        }

        studentRecord.isSuspended = true;
        await studentRecord.save();
    }

    static retrieveForNotificationStudent = async (body: RetrieveForNotification): Promise<RetrieveForNotificationRes> => {
        //validate input
        const { error, value } = retrieveForNotificationsSchema.validate(body)

        if (error) {
            throw new CustomError(HttpStatus.BAD_REQUEST, error.details[0].message)
        }

        const { teacher, notification } = value;

        // exact email from notification
        const words: string[] = notification.split(' ');
        const mentionedEmails: string[] = words
            .filter((word: string) => word.startsWith('@'))
            .map((word: string) => word.slice(1));

        // validate email in mention notification
        const invalidEmails: string[] = mentionedEmails.filter((email: string) => Joi.string().email().validate(email).error);
        if (invalidEmails.length > 0) {
            throw new CustomError(HttpStatus.BAD_REQUEST, `Invalid email addresses in mention: ${invalidEmails.join(', ')}`)
        }

        // find the teacher by email
        const teacherRecord: Teacher | null = await db.Teacher.findOne({ where: { email: teacher } });
        if (!teacherRecord) {
            throw new CustomError(HttpStatus.NOT_FOUND, "Teacher not found!")
        }

        // find all student under the teacher
        const teacherStudentRecords: TeacherStudentRes[] = await TeacherStudent.findAll({
            where: { teacherId: teacherRecord.id },
            include: [
                {
                    model: Student,
                    attributes: ['email'],
                },
            ],
        });

        // get email of student under the teacher
        const registeredStudentEmails: string[] = teacherStudentRecords
            .map((teacherStudent: TeacherStudentRes) => teacherStudent?.Student?.email)
            .filter((email: string | undefined) => email != undefined);

        // find suspended student 
        const suspendedStudentEmails: Student[] = await db.Student.findAll({
            where: {
                email: {
                    [Op.in]: [...registeredStudentEmails, ...mentionedEmails],
                },
                isSuspended: 1
            },
            attributes: ['email'],
        });

        const suspendedEmails: string[] = suspendedStudentEmails.map((student: Student) => student.email);

        // get final result
        const eligibleEmails: Set<string> = new Set([
            ...registeredStudentEmails.filter((email: string) => !suspendedEmails.includes(email)),
            ...mentionedEmails.filter((email: string) => !suspendedEmails.includes(email)),
        ]);

        return { recipients: [...eligibleEmails] };
    }
}
