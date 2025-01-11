import { Request, Response, NextFunction } from "express";
import teacherService from "../services/teacher.service"
import { HttpStatus } from "../constants/HttpStatus";

export default class TeacherController {
    static registerStudent = async (req: Request, res: Response, next: NextFunction) => {
        await teacherService.registerStudent(req.body);

        res.status(HttpStatus.NO_CONTENT).json("");
    };

    static getCommonStudents = async (req: Request, res: Response, next: NextFunction) => {
        const commonStudents = await teacherService.getCommonStudents(req.query)

        res.status(HttpStatus.OK).json(commonStudents)
    }

    static suspendStudent = async (req: Request, res: Response, next: NextFunction) => {
        await teacherService.suspendStudent(req.body);

        res.status(HttpStatus.NO_CONTENT).json("");
    };

    static retrieveForNotificationStudent = async (req: Request, res: Response, next: NextFunction) => {
        const listRecipients = await teacherService.retrieveForNotificationStudent(req.body);

        res.status(HttpStatus.OK).json(listRecipients);
    };
}

