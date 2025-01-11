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
}

