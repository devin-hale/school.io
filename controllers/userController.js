import User from "./../models/userModel.js";
import Org from "./../models/orgModel.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import authController from "./emailAuthController.js";
import util from "util";

//Gets user information
const user_info = asyncHandler(async (req, res, next) => {
	const singleUser = await User.findOne({
		email: req.body.email,
		password: req.body.password,
	}).exec();

	res.json({ message: singleUser });
});

//Creates account.
const create_account_post = [
	//Sanitize
	body("first_name", "First name bust contain at least 1 character.")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("last_name", "Last name bust contain at least 1 character.")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("email")
		.trim()
		.isLength({ min: 1 })
		.withMessage("Email is required.")
		.bail()
		.isEmail()
		.withMessage("Email not valid.")
		.bail()
		.escape(),
	body("password")
		.trim()
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long.")
		.bail()
		.escape(),

	//Handlers
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render("./../views/accountCreate/createAccount.ejs", {
				message: "Error creating account.",
			});
		} else {
			//Checks if email exists already.
			const emailExists = await User.findOne({ email: req.body.email }).exec();
			//If email doesn't exist, encrypt password and store new user account in DB.
			if (!emailExists) {
				const organization = await Org.findOne({
					orgCode: req.body.orgCode,
				}).exec();
				const hashAsync = util.promisify(bcrypt.hash);
				const hashedPass = await hashAsync(req.body.password, 10);

				const newUser = new User({
					first_name: req.body.first_name,
					last_name: req.body.last_name,
					email: req.body.email,
					gender: req.body.gender,
					password: hashedPass,
					org: organization._id,
				});

				const savedUser = await newUser.save();

				authController.createAuth(savedUser, req);

				res.render("./../views/accountCreate/verify.ejs");
			} else {
				//If email does exist, re-render page with error message.
				res.render("./../views/accountCreate/createAccount.ejs", {
					message: "Email already in use.",
					orgCode: req.body.orgCode,
				});
			}
		}
	}),
];

export default { user_info, create_account_post };
