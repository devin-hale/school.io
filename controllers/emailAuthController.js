import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import User from "./../models/userModel.js";
import emailAuth from "./../models/emailAuth.js";

//POST :: Verify Code
const verify_user = [
	body("code", "Invalid verification code.").trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render("./../views/accountCreate/createAccount.ejs", {
				message: "Invalid verification code.",
			});
		} else {
			const match = await emailAuth.findOne({ code: req.body.code }).exec();

			if (!match) {
				res.render("./../views/accountCreate/createAccount.ejs", {
					message: "Invalid verification code.",
				});
			} else {
				const verifiedUser = await User.findOneAndUpdate(
					{ _id: match.user },
					{ verified: true },
					{ new: true }
				);

				await emailAuth.deleteOne({ code: req.body.code });

				res.render("./../views/index.ejs", {
					message: "Account successfully verified! Please login:",
					user: req.user,
				});
			}
		}
	}),
];

export default { verify_user };
