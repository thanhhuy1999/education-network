import TeacherService from "../../src/services/TeacherService";
import TeacherController from "../../src/controllers/TeacherController";
import { HttpStatus } from "../../src/constants/HttpStatus";

describe("TeacherController", () => {
    let req: any, res: any, next: any;

    beforeEach(() => {
        req = {
            body: {},
            query: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        next = jest.fn();
    });

    describe("RegisterStudentController", () => {
        it("Should call TeacherService.registerStudent and return no content", async () => {
            // Sử dụng spyOn để theo dõi phương thức registerStudent
            const registerStudentSpy = jest.spyOn(TeacherService, "registerStudent").mockResolvedValue();

            await TeacherController.registerStudent(req, res, next);

            // Kiểm tra phương thức đã được gọi với đúng tham số
            expect(registerStudentSpy).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
            expect(res.json).toHaveBeenCalledWith("");

            // Đảm bảo phương thức spy được gọi ít nhất một lần
            expect(registerStudentSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("GetCommonStudentsController", () => {
        it("should call TeacherService.getCommonStudents and return the list of common students", async () => {
            const mockStudents = { students: ["student1@gmail.com", "student2@gmail.com"] };
            const getCommonStudentsSpy = jest.spyOn(TeacherService, "getCommonStudents").mockResolvedValue(mockStudents);

            req.query = { teacher: "teacherken@gmail.com" };

            await TeacherController.getCommonStudents(req, res, next);

            expect(getCommonStudentsSpy).toHaveBeenCalledWith(req.query);
            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.json).toHaveBeenCalledWith(mockStudents);
        });
    });

    describe("SuspendStudentController", () => {
        it("Should call TeacherService.suspendStudent and return no content", async () => {
            const suspendStudentSpy = jest.spyOn(TeacherService, "suspendStudent").mockResolvedValue();
    
            req.body = { student: "student1@gmail.com" };
    
            await TeacherController.suspendStudent(req, res, next);
    
            expect(suspendStudentSpy).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(HttpStatus.NO_CONTENT);
            expect(res.json).toHaveBeenCalledWith("");
    
            expect(suspendStudentSpy).toHaveBeenCalledTimes(1);
        });
    
    });
    
    describe("RetrieveForNotificationStudentController", () => {
        it("Should call TeacherService.retrieveForNotificationStudent and return the list of recipients", async () => {
            const mockRecipients = { recipients: ["student1@gmail.com", "student2@gmail.com"] };
            const retrieveForNotificationStudentSpy = jest.spyOn(TeacherService, "retrieveForNotificationStudent").mockResolvedValue(mockRecipients);
    
            req.body = {
                teacher: "teacherken@gmail.com",
                notification: "Hello @student1@gmail.com @student2@gmail.com",
            };
    
            await TeacherController.retrieveForNotificationStudent(req, res, next);
    
            expect(retrieveForNotificationStudentSpy).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.json).toHaveBeenCalledWith(mockRecipients);
        });
    });
});
