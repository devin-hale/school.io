import User from "./../models/userModel.js";
import Org from "./../models/orgModel.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";

//Gets user information
const user_info = asyncHandler(async (req, res, next) => {
	const singleUser = await User.findOne({
		email: req.body.email,
		password: req.body.password,
	}).exec();

	res.json({ message: singleUser });
});

//TODO: Add password encryption/comparison.
const user_login = asyncHandler(async (req, res, next) => {
	const userExists = await User.findOne({
		email: req.body.email,
		password: req.body.password,
	}).exec();

	if (!userExists) {
		res.render("./../views/index.ejs", {
			message: "No user was found with that username and password combination.",
		});
	} else {
		//TODO: Forward to landing page.
		res.render("./../views/index.ejs", {
			message: "Successful login!",
		});
	}
});

//TODO: Add bcrypt password encryption, and user verification.
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
				message: errors.array(),
			});
		} else {
			const emailExists = await User.findOne({ email: req.body.email }).exec();
			if (!emailExists) {
				const organization = await Org.findOne({
					orgCode: req.body.orgCode,
				}).exec();
				const newUser = new User({
					first_name: req.body.first_name,
					last_name: req.body.last_name,
					email: req.body.email,
					gender: req.body.gender,
					password: req.body.password,
					org: organization._id,
				});

				await newUser.save();
				res.render("./../views/accountCreate/success.ejs");
			} else {
				res.render("./../views/accountCreate/createAccount.ejs", {
					message: "Email already in use.",
				});
			}
		}
	}),
];

export default { user_info, user_login, create_account_post };
