import { Options } from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();

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
                url: `http://localhost:${process.env.PORT}`, //assume using localhost; can change url if deploy to production
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};

export default swaggerOptions;
