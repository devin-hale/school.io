import express from "express";
import passport from "./passport-config.js";

const router = express.Router();

//GET :: Class Homepage
router.get("/", (req, res) => {
	res.render("./../views/class/class.ejs", { user: req.user });
});

export default router;
