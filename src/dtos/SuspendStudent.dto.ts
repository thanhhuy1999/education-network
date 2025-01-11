import Joi from "joi"

export interface SuspendStudent {
    student: string;
}

export const suspendStudentSchema = Joi.object({
    student: Joi.string().email().required().messages({
      'string.email': 'Student email must be a valid email address',
      'any.required': 'Student email is required',
    }),
  });