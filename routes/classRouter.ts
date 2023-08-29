import express, { Router } from "express";
import classController from "../controllers/classController.js";

const router : Router = express.Router();

router.get("/:classId", classController.get_class_instance);

router.get("/user/:userId", classController.get_user_classes);

router.get("/org/:orgId", classController.get_org_classes);

router.post("/create", classController.create_class)

router.put("/edit/:classId", classController.edit_class)

router.put("/:classId/teachers/add", classController.add_teacher)

router.put("/:classId/teachers/remove", classController.remove_teacher)

export default router;
