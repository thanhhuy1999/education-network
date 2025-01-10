import { Router } from "express";
import TeacherController from "../controllers/teacher.controller";

const teacherRoute = Router();

teacherRoute.post("/register", TeacherController.registerStudent);


export default teacherRoute;
