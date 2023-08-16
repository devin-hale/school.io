import express from "express";
import studentController from "./../controllers/studentController.js";

const router = express.Router();

//TODO: All students page for org admin.
router.get("/");

//GET :: Student Instance Page
router.get("/:id", studentController.student_details_page);

export default router;
