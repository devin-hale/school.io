import express from "express";
import userController from "./../controllers/userController.js";
import orgController from "./../controllers/orgController.js";
import emailAuthController from "./../controllers/emailAuthController.js";
import passport from "./passport-config.js";

const router = express.Router();

//GET :: Login Page
router.get("/", (req, res) => {
	if (req.user) res.redirect("/classes");
	else res.render("./../views/index.ejs", { user: req.user, message: "" });
});

//POST :: Attempt Login
router.post(
	"/login",
	passport.authenticate("local", {
		failureFlash: true,
		successRedirect: "/classes",
		failureRedirect: "/",
	})
);

//GET :: Logout
router.get("/logout", (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

//GET :: Route to Org Verify Page
router.get("/account/org_verify", (req, res) => {
	res.render("./../views/accountCreate/verifyOrg.ejs", { message: "" });
});

//POST :: Route to Org Verify
router.post("/account/org_verify", orgController.org_code_verify);

//GET :: Route to Account Creation Page
router.get("/account/create", (req, res) => {
	res.render("./../views/accountCreate/createAccount.ejs", {
		message: "",
		orgCode: "",
	});
});

//POST :: Create Account Attempt
router.post("/account/create", userController.create_account_post);

//POST :: Verify User
router.post("/verify", emailAuthController.verify_user);

export default router;
