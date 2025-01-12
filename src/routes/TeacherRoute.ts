import { Router } from "express";
import TeacherController from "../controllers/TeacherController";

const teacherRoute = Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a list of students by a teacher
 *     description: Allows a teacher to register multiple students by providing their email addresses.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacher:
 *                 type: string
 *                 format: email
 *                 example: teacherken@gmail.com
 *               students:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *                   example: studentjon@gmail.com
 *     responses:
 *       204:
 *         description: Successfully registered students.
 *       400:
 *         description: Invalid request data.
 */
teacherRoute.post("/register", TeacherController.registerStudent);

/**
 * @swagger
 * /api/commonstudents:
 *   get:
 *     summary: Retrieve a list of students common to a given list of teachers
 *     description: Returns students who are registered to all the provided teachers.
 *     parameters:
 *       - in: query
 *         name: teacher
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             format: email
 *         description: The email address(es) of the teacher(s) to filter students by.
 *         required: true
 *         example: ["teacherken@gmail.com", "teacherjoe@gmail.com"]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of common students.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: email
 *                   example:
 *                     - "commonstudent1@gmail.com"
 *                     - "commonstudent2@gmail.com"
 *                     - "student_only_under_teacher_ken@gmail.com"
 *       400:
 *         description: Invalid request (e.g., missing or malformed teacher parameter).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Teacher email is required."
 */
teacherRoute.get("/commonstudents", TeacherController.getCommonStudents);

/**
 * @swagger
 * /api/suspend:
 *   post:
 *     summary: Suspend a specified student
 *     description: Allows a teacher to suspend a specific student by providing their email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student:
 *                 type: string
 *                 format: email
 *                 description: The email address of the student to be suspended.
 *                 example: studentmary@gmail.com
 *     responses:
 *       204:
 *         description: Student successfully suspended.
 *       400:
 *         description: Invalid request (e.g., missing or malformed student parameter).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Student email is required"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */
teacherRoute.post("/suspend", TeacherController.suspendStudent);

/**
 * @swagger
 * /api/retrievefornotifications:
 *   post:
 *     summary: Retrieve a list of students who can receive a given notification
 *     description: Returns a list of students who meet the criteria to receive a notification from a specific teacher. 
 *                  The criteria include not being suspended and either being registered to the teacher or being @mentioned in the notification text.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacher:
 *                 type: string
 *                 format: email
 *                 description: The email address of the teacher sending the notification.
 *                 example: teacherken@gmail.com
 *               notification:
 *                 type: string
 *                 description: The text of the notification. Students can be @mentioned in this text.
 *                 example: Hello students! @studentagnes@gmail.com @studentmiche@gmail.com
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of recipients.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipients:
 *                   type: array
 *                   description: List of email addresses of students eligible to receive the notification.
 *                   items:
 *                     type: string
 *                     format: email
 *                   example:
 *                     - studentbob@gmail.com
 *                     - studentagnes@gmail.com
 *                     - studentmiche@gmail.com
 *       400:
 *         description: Invalid request (e.g., missing required fields).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Teacher email is required"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong."
 */
teacherRoute.post("/retrievefornotifications", TeacherController.retrieveForNotificationStudent);

export default teacherRoute;
