import { Teacher } from '../models/teacher.model';
import { Student } from '../models/student.model';
import { TeacherStudent } from '../models/teacherStudent.model';
import { CustomError } from '../util/CustomError';
import { HttpStatus } from '../constants/HttpStatus';

export const seedData = async () => {
    try {
        //ensure does not have data for teacher and student before
        if (await Teacher.count() === 0) {
            const teachers = [
                { email: 'teacherken@gmail.com' },
                { email: 'teacherjoe@gmail.com' },
            ];

            console.log('Seeding teachers...');
            for (const teacher of teachers) {
                await Teacher.create({
                    ...teacher,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }

            console.log("Seeding succesfully!");
        }

        if (await Student.count() === 0) {
            const students = [
                { email: 'studentjon@gmail.com', isSuspended: false },
                { email: 'studenthon@gmail.com', isSuspended: false },
                { email: 'studentbob@gmail.com', isSuspended: false },
                { email: 'student_only_under_teacher_ken@gmail.com', isSuspended: false },
                { email: 'commonstudent1@gmail.com', isSuspended: false },
                { email: 'commonstudent2@gmail.com', isSuspended: false },
                { email: 'studentmary@gmail.com', isSuspended: false },
            ];

            console.log('Seeding students...');
            for (const student of students) {
                await Student.create({
                    ...student,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }

            console.log("Seeding succesfully!");
        }

        // if (await TeacherStudent.count() === 0) {
        //     const teacherStudents = [
        //         { teacherId: 1, studentId: 1 },

        //     ];

        //     console.log('Seeding teacher-student relationships...');
        //     for (const teacherStudent of teacherStudents) {
        //         await TeacherStudent.create({
        //             ...teacherStudent,
        //             createdAt: new Date(),
        //             updatedAt: new Date(),
        //         });
        //     }
        // }
    } catch (error) {
        throw new CustomError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create the users.");
    }
};