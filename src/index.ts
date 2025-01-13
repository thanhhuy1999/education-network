import express from "express";
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "../swagger.config";
import db from "./models";
import bodyParser from "body-parser";
import { seedData } from "./seeds/SeedData";
import { errorHandler } from "./utils/CustomError";
import router from "./routes";

const app = express();
const port = 3000;

//using body parser to get data from body
//using cors
app.use(bodyParser.json());
app.use(cors())

// create swagger-docs
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// implement swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// setup for logging
// create path
const logDir = path.join(__dirname, 'logs');
const accessLogFile = path.join(logDir, 'access.log');

// automatic create folder if dont exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
    console.log(`Created log directory: ${logDir}`);
}

// automatic create logging file if dont exist
if (!fs.existsSync(accessLogFile)) {
    fs.writeFileSync(accessLogFile, '', { flag: 'w' });
    console.log(`Created log file: ${accessLogFile}`);
}

// create stream logging
const accessLogStream = fs.createWriteStream(accessLogFile, { flags: 'a' }); //overwirte data

// using morgan
app.use(morgan('combined', { stream: accessLogStream })); //detail infor in file
app.use(morgan('dev')); // simple infor in console

app.use(router)

db.sequelize
    .sync({ alter: true }) //update column if have any change || create new when initial
    .then(() => {
        seedData(); //create mock data for test
        console.log("Synchronization complete.");
    })
    .catch((error: any) => {
        console.error("Unable to connect to the database:", error);
    });

//using handle global error
app.use(errorHandler);

//start server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
