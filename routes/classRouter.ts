import express, { Router } from "express";
import classController from "../controllers/classController.js";

const router: Router = express.Router();

// TODO: GET route that searches all classes with query terms.

router.get("/:classId", classController.get_class_instance);

//TODO : Swap this to make it a user route.
router.get("/user/:userId", classController.get_user_classes);

//TODO : Swap this to make it an org route.
router.get("/org/:orgId", classController.get_org_classes);

router.post("/create", classController.create_class);

router.put("/edit/:classId", classController.edit_class);

router.put("/:classId/teachers/add", classController.add_teacher);

router.put("/:classId/teachers/remove", classController.remove_teacher);

//TODO : Controller needs to find all students with the deleted classID and remove the ref.
router.delete("/:classId/delete", classController.delete_class);

export default router;
