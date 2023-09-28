import User, { UserInterface } from './../models/userModel.js';
import Org, { OrgInterface } from './../models/orgModel.js';
import ClassModel, { ClassInterface } from './../models/classModel.js';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';
import {
	param,
	body,
	validationResult,
	Result,
	ValidationError,
	query,
} from 'express-validator';

import bcrypt from 'bcryptjs';
import util from 'util';

import authController from './emailAuthController.js';
import { Document } from 'mongoose';

import { Payload } from './utils/payload.js';

const hashAsync: (arg1: string, arg2: string | number) => Promise<string> =
	util.promisify(bcrypt.hash);

const search_user: RequestHandler[] = [
	query('search').trim(),
	asyncHandler(async (req, res, next): Promise<void> => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request', 400, null));
		} else {
			try {
				if (!req.query.search) {
					res.status(200).json({ searchResults: [] });
				} else {
					const searchQuery = new RegExp(`${req.query.search}`, 'i');
					let searchResults: any[] = await User.find({
						$or: [{ first_name: searchQuery }, { last_name: searchQuery }],
					})
						.populate('org')
						.lean()
						.exec();

					if (
						req.body.token.accType == 'Basic' ||
						req.body.token.AccType == 'Admin'
					) {
						searchResults = searchResults.filter(
							(user) => user.org._id == req.body.token.org
						);
					}
					const resPayLoad: Payload = new Payload(
						'Search complete.',
						200,
						searchResults
					);
					res.status(200).json(resPayLoad);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_user: RequestHandler[] = [
	param('userId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request', 400, null));
		} else {
			try {
				const singleUser: UserInterface | null = await User.findById(
					{ _id: req.params.userId },
					{ password: 0 }
				)
					.lean()
					.exec();

				if (singleUser) {
					res.json(
						new Payload(
							`Retrieved user by ID: ${req.params.userId}`,
							200,
							singleUser
						)
					);
				} else {
					res
						.status(404)
						.json(
							new Payload(`User ${req.params.userId} not found.`, 404, null)
						);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_user_classes: RequestHandler[] = [
	param('userId').trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const classes: ClassInterface[] | undefined[] = await ClassModel.find({
					teachers: req.params.userId,
				})
					.lean()
					.populate('teachers')
					.exec();

				res.json(
					new Payload(
						`Retrieved classes for user ID: ${req.params.userId}`,
						200,
						classes
					)
				);
			} catch (err) {
				next(err);
			}
		}
	}),
];

const create_account: RequestHandler[] = [
	body('first_name', 'First name must contain at least 1 character.')
		.trim()
		.isLength({ min: 1 }),
	body('last_name', 'Last name must contain at least 1 character.')
		.trim()
		.isLength({ min: 1 }),
	body('email')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Email is required.')
		.bail()
		.isEmail()
		.withMessage('Email not valid.')
		.bail(),
	body('password')
		.trim()
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long.')
		.bail(),

	asyncHandler(async (req, res) => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			const emailExists: UserInterface | null = await User.findOne({
				email: req.body.email,
			}).exec();

			if (!emailExists) {
				const organization = await Org.findOne({
					orgCode: req.body.orgCode,
				}).exec();
				const hashedPass: string = await hashAsync(req.body.password, 10);

				const newUser = new User({
					first_name: req.body.first_name,
					last_name: req.body.last_name,
					email: req.body.email,
					gender: req.body.gender,
					password: hashedPass,
					org: organization?._id,
				});

				const savedUser: UserInterface | null = await newUser.save();

				await authController.createAuth(savedUser, req);

				if (!savedUser) {
					res
						.status(500)
						.json(new Payload(`Error creating account.`, 500, null));
				} else {
					res
						.status(201)
						.json(new Payload(`Account created successfully.`, 201, savedUser));
				}
			} else {
				res.status(400).json(new Payload('Email already in use.', 400, null));
			}
		}
	}),
];

const edit_user_info: RequestHandler[] = [
	param('userId').trim().isLength({ min: 1 }).escape(),
	body('first_name', 'First name must contain at least 1 character.')
		.trim()
		.isLength({ min: 1 }),
	body('last_name', 'Last name must contain at least 1 character.')
		.trim()
		.isLength({ min: 1 }),
	body('gender').isString().trim().escape(),
	body('accType').optional().isString().trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const targetUser: string = req.params.userId;

				const userExists: UserInterface | null = await User.findOne({
					_id: targetUser,
				})
					.lean()
					.exec();

				if (!userExists) {
					res.status(404).json(new Payload('User not found.', 404, null));
				} else {
					const editInfo = {
						first_name: req.body.first_name,
						last_name: req.body.last_name,
						gender: req.body.gender,
						accType: req.body.accType ?? userExists.accType,
					};

					const editedUser: Document | null = await User.findOneAndUpdate(
						{ _id: targetUser },
						editInfo,
						{ new: true }
					);

					if (!editedUser) {
						res
							.status(400)
							.json(
								new Payload(
									`Error saving incident ${req.params.userId}`,
									400,
									null
								)
							);
					} else {
						res
							.status(200)
							.json(
								new Payload(
									`User ${editedUser._id} saved successfully`,
									200,
									editedUser
								)
							);
					}
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const edit_email: RequestHandler[] = [
	param('userId').trim().isLength({ min: 1 }).escape(),
	body('email')
		.trim()
		.isLength({ min: 1 })
		.withMessage('Email is required.')
		.bail()
		.isEmail()
		.withMessage('Email not valid.')
		.bail(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const userExists: UserInterface | null = await User.findOne({
					_id: req.params.userId,
				})
					.lean()
					.exec();
				const emailInUse: UserInterface | null = await User.findOne({
					email: req.body.email,
				})
					.lean()
					.exec();

				if (!userExists) {
					res
						.status(404)
						.json(
							new Payload(`User ${req.params.userId} not found.`, 404, null)
						);
				} else if (emailInUse) {
					res
						.status(400)
						.json(
							new Payload(`Email ${req.body.email} already in use.`, 400, null)
						);
				} else {
					const editedUser: Document | null = await User.findOneAndUpdate(
						{ _id: req.params.userId },
						{ email: req.body.email },
						{ new: true }
					);
					if (!editedUser) {
						res
							.status(500)
							.json(
								new Payload(
									`Error changing email for user ${req.params.userId}`,
									500,
									null
								)
							);
					} else {
						res.json(
							new Payload(
								`Email changed for user ${req.params.userId}`,
								200,
								editedUser
							)
						);
					}
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const edit_password: RequestHandler[] = [
	param('userId').trim().isLength({ min: 1 }).escape(),
	body('currentPass')
		.trim()
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long.')
		.bail(),
	body('newPass')
		.trim()
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long.')
		.bail(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const userExists: UserInterface | null = await User.findOne({
					_id: req.params.userId,
				})
					.lean()
					.exec();
				if (!userExists) {
					res
						.status(404)
						.json(
							new Payload(`User ${req.params.userId} not found`, 400, null)
						);
				} else {
					const match = await bcrypt.compare(
						req.body.currentPass,
						userExists.password
					);

					if (!match) {
						res
							.status(400)
							.json(new Payload(`Current password incorrect`, 400, null));
					} else {
						const newPass: string = await hashAsync(req.body.newPass, 10);
						const editedUser: Document | null = await User.findOneAndUpdate(
							{ _id: req.params.userId },
							{ password: newPass },
							{ new: true }
						);
						if (!editedUser) {
							res
								.status(500)
								.json(
									new Payload(
										`Error changing password for user ${req.params.userId}`,
										500,
										null
									)
								);
						} else {
							res.json(
								new Payload(
									`Password changed for user ${req.params.userId}`,
									200,
									editedUser
								)
							);
						}
					}
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const delete_user: RequestHandler[] = [
	param('userId').trim().isLength({ min: 1 }).escape(),
	body('password')
		.trim()
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long.')
		.bail(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const userExists: UserInterface | null = await User.findOne({
					_id: req.params.userId,
				})
					.lean()
					.exec();

				if (!userExists) {
					res.status(400).json({ message: 'User not found.' });
				} else {
					const match = bcrypt.compare(req.body.password, userExists.password);

					if (!match) {
						res.status(400).json({ message: 'Invalid password.' });
					} else {
						await User.findOneAndDelete({ _id: req.params.userId }).exec();
						await ClassModel.updateMany(
							{ teachers: req.params.userId },
							{ $pull: { teachers: req.params.userId } }
						);

						res
							.status(200)
							.json(
								new Payload(
									`User ${req.params.userId} deleted`,
									200,
									req.params.userId
								)
							);
					}
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const find_all_by_org: RequestHandler[] = [
	param('orgId').trim().isLength({ min: 1 }).escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			const orgExists: OrgInterface | null = await Org.findOne({
				_id: req.params.orgId,
			})
				.lean()
				.exec();

			if (!orgExists) {
				res.status(400).json({ message: 'Organization not found.' });
			} else {
				const orgUsers: UserInterface[] | null = await User.find({
					org: req.params.orgId,
				})
					.lean()
					.exec();

				res
					.status(200)
					.json(
						new Payload(
							`Retrieved users for org ${req.params.orgId}`,
							200,
							orgUsers
						)
					);
			}
		}
	}),
];

const verify_user: RequestHandler[] = [
	param('userId').trim().isLength({ min: 1 }).escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const userExists: UserInterface | null = await User.findOne({
					_id: req.params.userId,
				})
					.lean()
					.exec();

				if (!userExists) {
					res.status(400).json({ message: 'User not found.' });
				} else {
					const verifiedUser: Document | null = await User.findOneAndUpdate(
						{ _id: req.params.userId },
						{ verified: true }
					).exec();

					res.status(200).json(new Payload(`User verified`, 200, verifiedUser));
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

export default {
	get_user,
	create_account,
	edit_user_info,
	edit_email,
	edit_password,
	delete_user,
	find_all_by_org,
	verify_user,
	search_user,
	get_user_classes,
};
