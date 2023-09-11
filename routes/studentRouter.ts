import express from "express";
import studentController from "./../controllers/studentController.js";
import verifyToken from "./authentication/verifyToken.js";

const router = express.Router();

// Search params: ?firstName=string,lastName=string,gradeLevel=number,gifted=boolean,retained=boolean,sped=boolean,ell=boolean,
router.get("/search", verifyToken, studentController.search_students);

router.get("/:studentId", verifyToken, studentController.get_student_info);


export default router;
