import { RequestHandler } from 'express';
import User, { UserInterface } from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import {
	body,
	param,
	query,
	validationResult,
	Result,
} from 'express-validator';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config.js';
import { Payload } from './utils/payload.js';

const secretKey: string = process.env.SECRET_KEY!;

const user_login: RequestHandler[] = [
	body('email').trim().isLength({ min: 1 }),
	body('password').trim().isLength({ min: 1 }),
	query('stayLogged').optional().trim().equals('true'),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			const userExists = await User.findOne({
				email: req.body.email,
			});

			if (!userExists) {
				res.status(400).json({ message: 'Username or password incorrect.' });
			} else {
				const match = await bcrypt.compare(
					req.body.password,
					userExists.password
				);

				if (!match) {
					res.status(400).json({ message: 'Username or password incorrect.' });
				} else {
					jwt.sign(
						{
							user: req.body.email,
							userId: userExists._id,
							firstName: userExists.first_name,
							lastName: userExists.last_name,
							org: userExists.org,
							accType: userExists.accType,
							verified: userExists.verified,
						},
						secretKey,
						{ expiresIn: req.query.stayLogged ? '9999 years' : '30 min' },
						(err, token) => {
							res.json({ message: 'Login Successful', token: token });
						}
					);
				}
			}
		}
	}),
];

const return_user: RequestHandler = asyncHandler(
	async (req, res, next): Promise<void> => {
		try {
			const bearerHeader = req.headers['authorization'];

			if (typeof bearerHeader !== 'undefined') {
				const bearerToken = bearerHeader.split(' ');

				jwt.verify(bearerToken[1], secretKey, (err, authData) => {
					if (err) {
						res.status(403).json(new Payload('Forbidden', 403, null));
					} else {
						res.json({
							message: 'User Authenticated',
							statusCode: 200,
							content: authData,
						});
					}
				});
			} else {
				res.status(403).json(new Payload(`Error authenticating user.`, 403, null))
			}
		} catch (error) {
			next(error);
		}
	}
);

export default { user_login, return_user };
