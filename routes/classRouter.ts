import express, { Router } from "express";
import classController from "../controllers/classController.js";

const router : Router = express.Router();


router.get("/:userId", classController.get_user_classes);



export default router;
