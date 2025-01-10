import express from "express";
import db from "./models";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/", (req: any, res: any) => {
    res.send("Hello world!");
});

db.sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("Synchronization complete.");
    })
    .catch((error: any) => {
        console.error("Unable to connect to the database:", error);
    });

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
