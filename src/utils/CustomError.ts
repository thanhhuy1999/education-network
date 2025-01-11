import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../constants/HttpStatus";

export class CustomError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string,) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (error instanceof CustomError) {
        res.status(error.statusCode).json({
            errorMessage: error.message,
            errorCode: error.statusCode,
        });
    } else {
        console.log(error)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            errorMessage: "Something went wrong.",
            errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    }
};
