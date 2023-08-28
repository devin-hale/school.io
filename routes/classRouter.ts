import express, { Router } from "express";
import classController from "../controllers/classController.js";

const router : Router = express.Router();

router.get("/:classId", classController.get_class_instance);

router.get("/user/:userId", classController.get_user_classes);

router.get("/org/:orgId", classController.get_org_classes);

router.post("/create", classController.create_class)

export default router;
