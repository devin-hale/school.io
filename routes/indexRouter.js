import express from "express";
import userController from "./../controllers/userController.js";

const router = express.Router();

//Login Page
router.get("/", (req, res) => {
	res.render("./../views/index.ejs", { message: "" });
});

//Attempt Login
router.post("/login", userController.user_login);

//Route to Account Creation Page
router.get("/createAccount", (req, res) => {
	res.render("./../views/accountCreate/createAccount.ejs", { message: "" });
});

//Create Account Attempt
router.post("/createAccount", userController.create_account_post);

export default router;
