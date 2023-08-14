import express from "express";
import userController from "./../controllers/userController.js";
import orgController from "./../controllers/orgController.js";

const router = express.Router();

//GET :: Login Page
router.get("/", (req, res) => {
	res.render("./../views/index.ejs", { message: "" });
});

//POST :: Attempt Login
router.post("/login", userController.user_login);

//GET :: Route to Org Verify Page
router.get("/account/org_verify", (req, res) => {
	res.render("./../views/accountCreate/verifyOrg.ejs", { message: "" });
});

//POST :: Route to Org Verify
router.post("/account/org_verify", orgController.org_code_verify);

//GET :: Route to Account Creation Page
router.get("/account/create", (req, res) => {
	res.render("./../views/accountCreate/createAccount.ejs", { message: "" });
});

//POST :: Create Account Attempt
router.post("/account/create", userController.create_account_post);

export default router;
