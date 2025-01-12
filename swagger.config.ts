import { Options } from "swagger-jsdoc";
import dotenv from "dotenv";
import { TeacherRoutesSwagger } from "./src/swaggers/TeacherRoutesSwagger";
dotenv.config();

const PORT = process.env.PORT || 3000
const swaggerOptions: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "This is the API documentation for Education Network application.",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`, //assume using localhost; can change url if deploy to production
                description: "Local Server"
            },
        ],
        paths: {
            ...TeacherRoutesSwagger,
        },
    },
    apis: ["./src/routes/*.ts"],
};

export default swaggerOptions;
