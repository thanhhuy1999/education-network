export const TeacherRoutesSwagger = {
    "/api/register": {
        post: {
            summary: "Register a list of students by a teacher",
            description: "Allows a teacher to register multiple students by providing their email addresses.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                teacher: { type: "string", format: "email", example: "teacherken@gmail.com" },
                                students: {
                                    type: "array",
                                    items: { type: "string", format: "email", example: "studentjon@gmail.com" }
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                204: { description: "Successfully registered students." },
                400: { description: "Invalid request data." }
            }
        }
    },
    "/api/commonstudents": {
        get: {
            summary: "Retrieve a list of students common to a given list of teachers",
            description: "Returns students who are registered to all the provided teachers.",
            parameters: [
                {
                    in: "query",
                    name: "teacher",
                    schema: { type: "array", items: { type: "string", format: "email" } },
                    description: "The email address(es) of the teacher(s) to filter students by.",
                    required: true,
                    example: ["teacherken@gmail.com", "teacherjoe@gmail.com"]
                }
            ],
            responses: {
                200: {
                    description: "Successfully retrieved the list of common students.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    students: {
                                        type: "array",
                                        items: { type: "string", format: "email" },
                                        example: ["commonstudent1@gmail.com", "commonstudent2@gmail.com"]
                                    }
                                }
                            }
                        }
                    }
                },
                400: { description: "Invalid request data." }
            }
        }
    },
    "/api/suspend": {
        post: {
            summary: "Suspend a specified student",
            description: "Allows a teacher to suspend a specific student by providing their email address.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                student: { type: "string", format: "email", example: "studentmary@gmail.com" }
                            }
                        }
                    }
                }
            },
            responses: {
                204: { description: "Student successfully suspended." },
                400: { description: "Invalid request data." },
                500: { description: "Internal server error." }
            }
        }
    },
    "/api/retrievefornotifications": {
        post: {
            summary: "Retrieve a list of students who can receive a given notification",
            description: "Returns a list of students who meet the criteria to receive a notification from a specific teacher.",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                teacher: { type: "string", format: "email", example: "teacherken@gmail.com" },
                                notification: {
                                    type: "string",
                                    example: "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Successfully retrieved the list of recipients.",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    recipients: {
                                        type: "array",
                                        items: { type: "string", format: "email" },
                                        example: ["studentbob@gmail.com", "studentagnes@gmail.com"]
                                    }
                                }
                            }
                        }
                    }
                },
                400: { description: "Invalid request data." },
                500: { description: "Internal server error." }
            }
        }
    }
};
