import Joi from "joi"

export interface RegisterStudent {
    teacher: string;
    students: string[];
}

export const registerStudentSchema = Joi.object({
    teacher: Joi.string().email().required().messages({
        'string.email': 'Teacher email must be a valid email address',
        'any.required': 'Teacher email is required',
    }),
    students: Joi.array()
        .items(Joi.string().email().required().messages({
            'string.email': 'Each student email must be a valid email address',
        }))
        .min(1)
        .required()
        .messages({
            'array.base': 'Students must be an array of valid email addresses',
            'array.min': 'At least one student email must be provided',
            'any.required': 'Students field is required',
        }),
});