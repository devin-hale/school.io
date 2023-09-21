import Communication, {
	CommInterface,
} from './../../models/docTypes/comModel.js';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';
import { body, param, validationResult, Result } from 'express-validator';

const get_communication_instance: RequestHandler[] = [
	param('commId').trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid request.' });
		} else {
			try {
				const commExists: CommInterface | null = await Communication.findOne({
					_id: req.params.commId,
				})
					.populate('students_involved')
					.populate('parents_involved')
					.populate('staff_involved')
					.populate('others_involved')
					.populate('owner')
					.populate('access')
					.exec();

				if (!commExists) {
					res.status(404).json({ message: 'Communication not found.' });
				} else {
					res.json(commExists);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_user_comms: RequestHandler[] = [
	param('userId').trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid request.' });
		} else {
			try {
				const userComms: CommInterface[] = await Communication.find({
					owner: req.params.userId,
				})
					.populate('access')
					.populate('owner')
					.populate('staff_involved')
					.populate('students_involved')
					.populate('parents_involved')
					.populate('others_involved')
					.lean()
					.exec();

				res.json(userComms);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const create_communication: RequestHandler[] = [
	body('access').optional(),
	body('communication_type').isString(),
	body('date_of_occurence'),
	body('staff_involved').optional(),
	body('students_involved').optional(),
	body('parents_involved').optional(),
	body('others_involved').optional(),
	body('subject').isString().trim(),
	body('description').isString().trim(),
	body('followUp').isBoolean(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid request.' });
		} else {
			const newRecord = new Communication({
				owner: req.body.token.userId,
				access: req.body.access,
				communication_type: req.body.communication_type,
				date_of_occurence: req.body.date_oof_occurence,
				staff_involved: req.body.staff_involved,
				students_involved: req.body.students_involved,
				parents_involved: req.body.parents_involved,
				others_involved: req.body.others_involved,
				subject: req.body.subject,
				description: req.body.description,
				followUp: req.body.followUp,
				org: req.body.token.org,
			});

			const savedRecord = await newRecord.save();

			res.status(201).json(savedRecord);
		}
	}),
];

const edit_communication_info: RequestHandler[] = [
	param("commId").trim().escape(),
	body('communication_type').optional(),
	body('date_of_occurence').optional(),
	body('subject').trim().optional(),
	body('description').optional().trim(),
	body('followUp').optional(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid request.' });
		} else {
			try {
				const commExists: CommInterface | null = await Communication.findOne({
					_id: req.params.commId,
				});

				if (!commExists) {
					res
						.status(404)
						.json({ message: 'Communication document not found.' });
				} else {
					const editInfo = {
						communication_type:
							req.body.communication_type || commExists.communication_type,
						date_of_occurence:
							req.body.date_of_occurence || commExists.date_of_occurence,
						subject: req.body.subject || commExists.subject,
						descriptuion: req.body.description || commExists.description,
						followUp: req.body.followup || commExists.followUp,
					};

					const editedComm: CommInterface | null =
						await Communication.findOneAndUpdate(
							{ _id: req.params.commId },
							editInfo,
							{ new: true }
						);

					res.json(editedComm);
				}
			} catch (error) {
				next(error)
			}
		}
	}),
];

const edit_communication_involvement: RequestHandler[] = [
	param("commId").trim().escape(),
	body("staff_involved").optional().isArray(),
	body("students_involved").optional().isArray(),
	body("parents_involved").optional().isArray(),
	body("others_involved").optional().isArray(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid request.' });
		} else {
			try {
				const commExists: CommInterface | null = await Communication.findOne({
					_id: req.params.commId,
				});

				if (!commExists) {
					res
						.status(404)
						.json({ message: 'Communication document not found.' });
				} else {
					const editInfo = {
						staff_involved: req.body.staff_involved || commExists.staff_involved,
						students_involved: req.body.students_involved || commExists.students_involved,
						parents_involved: req.body.parents_involved || commExists.parents_involved,
						others_involved: req.body.others_involved || commExists.others_involved,
					};

					const editedComm: CommInterface | null =
						await Communication.findOneAndUpdate(
							{ _id: req.params.commId },
							editInfo,
							{ new: true }
						);

					res.json(editedComm);
				}
			} catch (error) {
				next(error)
			}
		}
	}),
];


const edit_communication_access: RequestHandler[] = [
	param("commId").trim().escape(),
	body("access").isArray(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid request.' });
		} else {
			try {
				const commExists: CommInterface | null = await Communication.findOne({
					_id: req.params.commId,
				});

				if (!commExists) {
					res
						.status(404)
						.json({ message: 'Communication document not found.' });
				} else {
					const editInfo = {
						access: req.body.access
					};

					const editedComm: CommInterface | null =
						await Communication.findOneAndUpdate(
							{ _id: req.params.commId },
							editInfo,
							{ new: true }
						);

					res.json(editedComm);
				}
			} catch (error) {
				next(error)
			}
		}
	}),
];

const delete_communication: RequestHandler[] = [
	param("commId").trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid request.' });
		} else {
			try {
				const commExists: CommInterface | null = await Communication.findOne({
					_id: req.params.commId,
				});

				if (!commExists) {
					res
						.status(404)
						.json({ message: 'Communication document not found.' });
				} else {
					await Communication.findOneAndDelete({_id: req.params.commId});

					res.json({message: 'Communication deleted.'});
				}
			} catch (error) {
				next(error)
			}
		}
	}),
];

export default {
	get_communication_instance,
	get_user_comms,
	create_communication,
	edit_communication_info,
	edit_communication_involvement,
	edit_communication_access,
	delete_communication,
};
