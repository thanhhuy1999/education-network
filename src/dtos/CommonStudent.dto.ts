import Joi from "joi";

export interface CommonStudentRes {
    students: string[] | [];
}

export interface CommonStudentReq {
    teacher: string | string[] | undefined;
}

export const getCommonStudentsSchema = Joi.object({
    teacher: Joi.alternatives()
        .try(
            Joi.string().email().message('Teacher must be a valid email address'),
            Joi.array().items(Joi.string().email().message('Each teacher in the list must be a valid email address'))
        )
        .required()
        .messages({
            'any.required': 'At least one teacher must be provided',
        }),
});
