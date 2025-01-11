import express from "express";
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import db from "./models";
import bodyParser from "body-parser";
import { seedData } from "./seed/seed-data";
import { errorHandler } from "./util/CustomError";
import router from "./routes";

const app = express();
const port = 3000;

app.use(bodyParser.json());

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

app.get("/", (req: any, res: any) => {
    res.send("Hello world!");
});

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
