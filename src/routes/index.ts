import teacherRoute from "./teacher.route";

import express from "express"

const router = express.Router();

router.use("/api", teacherRoute);

export default router
