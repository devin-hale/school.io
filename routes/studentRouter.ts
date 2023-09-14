import express from "express";
import studentController from "./../controllers/studentController.js";
import verifyToken from "./authentication/verifyToken.js";

const router = express.Router();

// Search params: ?name=First+Last, split in the controller
router.get("/search", verifyToken, studentController.search_student);

router.get("/:studentId", verifyToken, studentController.get_student_info);

router.get("/org/:orgId", verifyToken, studentController.get_org_students);

router.get(`/class/:classId`, verifyToken, studentController.get_class_students);

router.post(`/create`, verifyToken, studentController.create_student);

router.put('/:studentId/edit', verifyToken, studentController.edit_student_info);


//TODO:
//PUT Add student to class
//PUT Remove student from class
//PUT Toggle Active
//DELETE Delete Student



export default router;
