import { Request, Response, NextFunction } from "express";
import TeacherService from "../services/TeacherService"
import { HttpStatus } from "../constants/HttpStatus";

export default class TeacherController {
    static registerStudent = async (req: Request, res: Response, next: NextFunction) => {
        await TeacherService.registerStudent(req.body);

        res.status(HttpStatus.NO_CONTENT).json("");
    };

    static getCommonStudents = async (req: Request, res: Response, next: NextFunction) => {
        const commonStudents = await TeacherService.getCommonStudents(req.query)

        res.status(HttpStatus.OK).json(commonStudents)
    }

    static suspendStudent = async (req: Request, res: Response, next: NextFunction) => {
        await TeacherService.suspendStudent(req.body);

        res.status(HttpStatus.NO_CONTENT).json("");
    };

    static retrieveForNotificationStudent = async (req: Request, res: Response, next: NextFunction) => {
        const listRecipients = await TeacherService.retrieveForNotificationStudent(req.body);

        res.status(HttpStatus.OK).json(listRecipients);
    };
}

