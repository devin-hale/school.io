import { RequestHandler } from "express";
import User, { UserInterface } from '../models/userModel.js';
import asyncHandler from "express-async-handler";
import { body, param, query, validationResult, Result } from "express-validator";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import 'dotenv/config.js'

const secretKey: string = process.env.SECRET_KEY!

const user_login: RequestHandler[] = [
	body("email")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("password")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	query("stayLogged")
		.optional()
		.trim()
		.equals("true")
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid request." })
		} else {

			const userExists: UserInterface | null = await User.findOne({ email: req.body.email })

			if (!userExists) {
				res.status(400).json({ message: "Username or password incorrect." })
			} else {
				const match = bcrypt.compare(req.body.password, userExists.password)

				if (!match) {
					res.status(400).json({ message: "Username or password incorrect." })
				} else {

					jwt.sign({ user: req.body.email, org: userExists.org }, secretKey, { expiresIn: req.query.stayLogged ? "9999 years" : "30 min" }, (err, token) => {
						res.json({ token: token })
					})
				}
			}
		}
	})
];

export default { user_login }


