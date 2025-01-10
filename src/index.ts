import express from "express";
import db from "./models";
import bodyParser from "body-parser";
import { seedData } from "./seed/seed-data";
import { CustomError, errorHandler } from "./util/CustomError";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/", (req: any, res: any) => {
    res.send("Hello world!");
});

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
