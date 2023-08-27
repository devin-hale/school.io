import express from "express";
import passport from "./passport-config.js";
import classController from "../controllers/classController.js";
import checkUser from "./authentication/sessionAuth.js";

const router = express.Router();

//GET :: Class Homepage
router.get("/", function (req,res, err) {
    res.json({class: "pee"})

});

//GET :: Specific Class Page
//router.get("/:_id", classController.class_instance_page);

export default router;
