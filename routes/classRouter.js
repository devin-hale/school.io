import express from "express";
import passport from "./passport-config.js";
import classController from "../controllers/classController.js";

const router = express.Router();

//GET :: Class Homepage
router.get("/", classController.classes_page);

//GET :: Specific Class Page
//TODO - Make Page
router.get("/:_id", classController.class_instance_page);

export default router;
