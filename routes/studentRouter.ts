import express from "express";
import studentController from "./../controllers/studentController.js";
import verifyToken from "./authentication/verifyToken.js";

const router = express.Router();

// Search params: ?name=First+Last, split in the controller
router.get("/search", verifyToken, studentController.search_student);

router.get("/:studentId", verifyToken, studentController.get_student_info);

//TODO:
//GET All students by org
//GET All students by class
//POST create student
//PUT Add student to class
//PUT Remove student from class
//PUT Edit student info
//PUT Toggle Active
//DELETE Delete Student



export default router;
