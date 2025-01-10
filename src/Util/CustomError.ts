import { NextFunction, Request, Response } from "express";

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
    //   console.log(error);
    if (error instanceof CustomError) {
        res.status(error.statusCode).json({
            errorMessage: error.message,
            errorCode: error.statusCode,
        });
    } else {
        res.status(error.statusCode).json({
            errorMessage: "Something went wrong.",
            errorCode: 500,
        });
    }
};
