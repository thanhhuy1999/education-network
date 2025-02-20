import { Request, Response, NextFunction } from "express";
import TeacherService from "../services/TeacherService"
import { HttpStatus } from "../constants/HttpStatus";
import { CommonStudentReq, CommonStudentRes } from "../dtos/CommonStudent.dto";
import { RetrieveForNotificationRes } from "../dtos/RetrieveForNotification.dto";

export default class TeacherController {
    static registerStudent = async (req: Request, res: Response, next: NextFunction) => {
        await TeacherService.registerStudent(req.body);

        res.status(HttpStatus.NO_CONTENT).json("");
    };

    static getCommonStudents = async (req: Request, res: Response, next: NextFunction) => {
        const commonStudents: CommonStudentRes = await TeacherService.getCommonStudents(req.query as unknown as CommonStudentReq)

        res.status(HttpStatus.OK).json(commonStudents)
    }

    static suspendStudent = async (req: Request, res: Response, next: NextFunction) => {
        await TeacherService.suspendStudent(req.body);

        res.status(HttpStatus.NO_CONTENT).json("");
    };

    static retrieveForNotificationStudent = async (req: Request, res: Response, next: NextFunction) => {
        const listRecipients: RetrieveForNotificationRes = await TeacherService.retrieveForNotificationStudent(req.body);

        res.status(HttpStatus.OK).json(listRecipients);
    };

    static removeStudent = async (req: Request, res: Response, next: NextFunction) => {
        await TeacherService.removeStudent(req.body);

        res.status(HttpStatus.OK).json("");
    };
}