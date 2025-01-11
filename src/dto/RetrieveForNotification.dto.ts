import Joi from "joi";

export interface RetrieveForNotification {
    teacher: string;
    notification: string
}

export const retrieveForNotificationsSchema = Joi.object({
    teacher: Joi.string().email().required().messages({
        'string.base': 'Teacher email must be a string',
        'string.email': 'Teacher email must be a valid email',
        'any.required': 'Teacher email is required',
    }),
    notification: Joi.string().required().messages({
        'string.base': 'Notification text must be a string',
        'any.required': 'Notification text is required',
    }),
});