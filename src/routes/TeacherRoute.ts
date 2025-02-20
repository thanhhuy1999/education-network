import { Router } from "express";
import TeacherController from "../controllers/TeacherController";

const teacherRoute = Router();

teacherRoute.post("/register", TeacherController.registerStudent);
teacherRoute.get("/commonstudents", TeacherController.getCommonStudents);
teacherRoute.post("/suspend", TeacherController.suspendStudent);
teacherRoute.post("/retrievefornotifications", TeacherController.retrieveForNotificationStudent);

teacherRoute.post("/removestudent", TeacherController.removeStudent);

export default teacherRoute;
