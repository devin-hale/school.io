import User, { UserInterface } from "./../models/userModel.js";
import Org from "./../models/orgModel.js";
import asyncHandler from "express-async-handler";
import { Request, RequestHandler } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import authController from "./emailAuthController.js";
import util from "util";
import { SanitizersImpl } from "express-validator/src/chain/sanitizers-impl.js";

const get_user: RequestHandler = asyncHandler(async (req, res, next): Promise<void> => {
	try {
		const singleUser: UserInterface | null = await User.findById({ _id: req.params.userId }, { password: 0 }).lean().exec()

		if (singleUser) {
			res.json(singleUser);
		} else {
			res.status(404).json({ message: "User could not be found." })
		}
	} catch (error) {
		next(error)
	}
});

//Creates account.
const create_account_post: Array<SanitizersImpl<Request> | RequestHandler> = [
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
					org: organization?._id,
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

export default { get_user, create_account_post };
