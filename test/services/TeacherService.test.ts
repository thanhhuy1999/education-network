import { HttpStatus } from "../../src/constants/HttpStatus";
import TeacherService from "../../src/services/TeacherService";
import { CustomError } from "../../src/utils/CustomError";
import db from "../../src/models";
import { Op } from "sequelize";
import { StudentDTO } from "../../src/dtos/TeacherWithStudents.dto";

describe("TeacherService", () => {
    describe("RegisterStudentService", () => {
        it("Should throw an error if teacher or students are missing", async () => {
            const body = { teacher: "", students: [] };

            await expect(TeacherService.registerStudent(body)).rejects.toThrowError(
                new CustomError(HttpStatus.BAD_REQUEST, "\"teacher\" is not allowed to be empty")
            );
        });

        it("Should throw error if teacher not found", async () => {
            const body = { teacher: "test@teacher.com", students: ["test1@student.com"] };

            jest.spyOn(db.Teacher, "findOne").mockResolvedValue(null);

            await expect(TeacherService.registerStudent(body)).rejects.toThrowError(
                new CustomError(HttpStatus.NOT_FOUND, "Teacher not found!")
            );
        });

        it("Should throw error if students not found", async () => {
            const body = { teacher: "test@teacher.com", students: ["test1@student.com"] };

            jest.spyOn(db.Teacher, "findOne").mockResolvedValue({ id: 1, email: "test@teacher.com" });
            jest.spyOn(db.Student, "findAll").mockResolvedValue([]);

            await expect(TeacherService.registerStudent(body)).rejects.toThrowError(
                new CustomError(HttpStatus.BAD_REQUEST, "Students not found: test1@student.com")
            );
        });

        it("Should return if all student has been already registered", async () => {
            const body = { teacher: "test@teacher.com", students: ["test@student.com"] };

            jest.spyOn(db.Teacher, "findOne").mockResolvedValue({ id: 1, email: "test@teacher.com" });
            jest.spyOn(db.Student, "findAll").mockResolvedValue([{ id: 1, email: "test@student.com" }]);
            jest.spyOn(db.TeacherStudent, "findAll").mockResolvedValue([{ studentId: 1, teacherId: 1 }]);

            await expect(TeacherService.registerStudent(body)).resolves.not.toThrow();
        });

        it("Should successfully register students", async () => {
            const body = { teacher: "test@teacher.com", students: ["test1@student.com", "test2@student.com"] };

            jest.spyOn(db.Teacher, "findOne").mockResolvedValue({ id: 1, email: "test@teacher.com" });
            jest.spyOn(db.Student, "findAll").mockResolvedValue([{ email: "test1@student.com", id: 1 }, { email: "test2@student.com", id: 2 }]);
            jest.spyOn(db.TeacherStudent, "findAll").mockResolvedValue([]);
            jest.spyOn(db.TeacherStudent, "bulkCreate").mockResolvedValue([]);

            await expect(TeacherService.registerStudent(body)).resolves.not.toThrow();
        });
    });

    describe("GetCommonStudentsService", () => {
        it("Should throw error if teacher is invalid", async () => {
            const query = { teacher: "" };

            await expect(TeacherService.getCommonStudents(query)).rejects.toThrowError(
                new CustomError(HttpStatus.BAD_REQUEST, "\"teacher\" is not allowed to be empty")
            );
        });

        it("Should throw error if teacher not found", async () => {
            const query = { teacher: "teacher1@school.com" };

            jest.spyOn(db.Teacher, "findAll").mockResolvedValue([]);

            await expect(TeacherService.getCommonStudents(query)).rejects.toThrowError(
                new CustomError(HttpStatus.BAD_REQUEST, "One or more teachers not found: teacher1@school.com")
            );
        });

        it("Should return common students", async () => {
            const query = { teacher: ["teacher1@school.com", "teacher2@school.com"] };

            const mockTeachers = [
                { email: "teacher1@school.com", Students: [{ id: 1, email: "student1@school.com" }, { id: 2, email: "student_under_only_teacher1@school.com" }] },
                { email: "teacher2@school.com", Students: [{ id: 1, email: "student1@school.com" }] },
            ];

            const mockStudents = [{ id: 1, email: "student1@school.com" }]

            jest.spyOn(db.Teacher, "findAll").mockResolvedValue(mockTeachers as any);
            jest.spyOn(db.Student, "findAll").mockResolvedValue(mockStudents as any);

            const response = await TeacherService.getCommonStudents(query);
            expect(response.students).toEqual(["student1@school.com"]);
        });
    });

    describe("SuspendStudentService", () => {
        it("Should throw an error if input invalid", async () => {
            const body = { student: "invalidEmail@something" };

            await expect(TeacherService.suspendStudent(body)).rejects.toThrowError(
                new CustomError(HttpStatus.BAD_REQUEST, "Student email must be a valid email address")
            );
        });

        it("Should throw an error if student is not found", async () => {
            const body = { student: "nonexistent@student.com" };

            jest.spyOn(db.Student, "findOne").mockResolvedValue(null);

            await expect(TeacherService.suspendStudent(body)).rejects.toThrowError(
                new CustomError(HttpStatus.NOT_FOUND, "Student with email nonexistent@student.com not found")
            );
        });

        it("Should suspend a student successfully", async () => {
            const body = { student: "test@student.com" };

            jest.spyOn(db.Student, "findOne").mockResolvedValue({ email: "test@student.com", save: jest.fn() });

            await expect(TeacherService.suspendStudent(body)).resolves.not.toThrow();
        });
    });

    describe("RetrieveForNotificationStudentService", () => {
        it("Should throw an error if input invalid teacher", async () => {
            const body = { teacher: "invalidEmail@something", notification: "Hello everyone" };

            await expect(TeacherService.retrieveForNotificationStudent(body)).rejects.toThrowError(
                new CustomError(HttpStatus.BAD_REQUEST, "Teacher email must be a valid email")
            );
        });

        it("Should throw an error if email is invalid in notification", async () => {
            const body = { teacher: "teacher@school.com", notification: "Hello @invalid-email" };

            await expect(TeacherService.retrieveForNotificationStudent(body)).rejects.toThrowError(
                new CustomError(HttpStatus.BAD_REQUEST, "Invalid email addresses in mention: invalid-email")
            );
        });

        it("Should throw an error if teacher not found", async () => {
            const body = { teacher: "teacher@school.com", notification: "Hello everyone" };
            const mockFindAllStudent: StudentDTO[] = [
                { id: 1, email: "student1@school.com", isSuspended: false },
                { id: 2, email: "student2@school.com", isSuspended: false }
            ]

            jest.spyOn(db.Student, "findAll").mockResolvedValue(mockFindAllStudent);
            jest.spyOn(db.Teacher, "findOne").mockResolvedValue(null);

            await expect(TeacherService.retrieveForNotificationStudent(body)).rejects.toThrowError(
                new CustomError(HttpStatus.BAD_REQUEST, "Teacher not found!")
            );
        });

        it("Should throw an error if mentioned student not found", async () => {
            const body = { teacher: "teacher@school.com", notification: "Hello Hello @student1@school.com" };

            jest.spyOn(db.Student, "findAll").mockResolvedValue([]);
            jest.spyOn(db.Teacher, "findOne").mockResolvedValue({ id: 1, email: "teacher@school.com" });

            await expect(TeacherService.retrieveForNotificationStudent(body)).rejects.toThrowError(
                new CustomError(HttpStatus.BAD_REQUEST, "Student(s) not found: student1@school.com")
            );
        });


        it("Should return recipients correctly", async () => {
            const body = { teacher: "teacher@school.com", notification: "Hello @student1@school.com @student2@school.com" };
            const mockFindAllStudent: StudentDTO[] = [
                { id: 1, email: "student1@school.com", isSuspended: false },
                { id: 2, email: "student2@school.com", isSuspended: false }
            ]
            const mockTeacherWithStudents = {
                id: 1, email: "teacher@school.com",
                Students:
                    [
                        { id: 1, email: "student1@school.com", isSuspended: false }
                    ]
            }

            jest.spyOn(db.Student, "findAll").mockResolvedValue(mockFindAllStudent);
            jest.spyOn(db.Teacher, "findOne").mockResolvedValue(mockTeacherWithStudents);

            const response = await TeacherService.retrieveForNotificationStudent(body);
            expect(response.recipients).toEqual(["student1@school.com", "student2@school.com"]);
        });
    });
});
