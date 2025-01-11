import { Dialect } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export default {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT as Dialect,
        port: process.env.DB_PORT,
        logging: false,
    },
    //we can change information here later
    test: {
        username: "root",
        password: null,
        database: "database_test",
        host: "127.0.0.1",
        dialect: "mysql",
    },
    //we can change information here later
    production: {
        username: "root",
        password: null,
        database: "database_production",
        host: "127.0.0.1",
        dialect: "postgres",
    },
};
