import express from "express";

const router = express.Router();

//Login Page
router.get("/", (req, res) => {
	res.render("./../views/index.ejs");
});

//Attempt Login
router.post("/login", (req, res) => {
	//Login Logic Here
});

//Route to Account Creation Page
router.get("/createAccount", (req, res) => {
	//Logic
});

//Create Account Attempt
router.post("/createAccount", (req, res) => {
	//Account creation post
});

export default router;
