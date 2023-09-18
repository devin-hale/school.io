import PST, {
	PSTInterface,
	PSTHeaderInterface,
	PSTWeekInterface,
} from './../../models/docTypes/pstModel';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';
import {
	body,
	param,
	validationResult,
	Result,
	ValidationError,
} from 'express-validator';

const get_pst_instance: RequestHandler[] = [
	param('pstId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({
				message: 'Invalid request.',
				errors: errors.array().map((e: ValidationError) => e.msg),
			});
		} else {
			try {
				const pstInstance: PSTInterface | null = await PST.findOne({
					_id: req.params.pstId,
				})
					.populate('owner')
					.populate('class')
					.populate('access')
					.populate('header.student');

				if (!pstInstance) {
					res.status(404).json({ message: 'PST Document not found.' });
				} else {
					res.json(pstInstance);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_user_pst: RequestHandler[] = [
	param('userId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({
				message: 'Invalid request.',
				errors: errors.array().map((e: ValidationError) => e.msg),
			});
		} else {
			try {
				const userPSTs: PSTInterface[] = await PST.find({
					owner: req.params.userId,
				})
					.populate('owner')
					.populate('class')
					.populate('access')
					.populate('header.student');

				res.json(userPSTs);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_org_pst: RequestHandler[] = [
	param('orgId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({
				message: 'Invalid request.',
				errors: errors.array().map((e: ValidationError) => e.msg),
			});
		} else {
			try {
				const orgPSTs: PSTInterface[] = await PST.find({
					org: req.params.orgId,
				})
					.populate('owner')
					.populate('class')
					.populate('access')
					.populate('header.student');

				res.json(orgPSTs);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_class_pst: RequestHandler[] = [
	param('classId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({
				message: 'Invalid request.',
				errors: errors.array().map((e: ValidationError) => e.msg),
			});
		} else {
			try {
				const classPSTs: PSTInterface[] = await PST.find({
					class: req.params.classId,
				})
					.populate('owner')
					.populate('class')
					.populate('access')
					.populate('header.student');

				res.json(classPSTs);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_student_pst: RequestHandler[] = [
	param('studentId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({
				message: 'Invalid request.',
				errors: errors.array().map((e: ValidationError) => e.msg),
			});
		} else {
			try {
				const studentPSTs: PSTInterface[] = await PST.find({
					'header.student': req.params.studentId,
				})
					.populate('owner')
					.populate('class')
					.populate('access')
					.populate('header.student');

				res.json(studentPSTs);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const create_pst: RequestHandler[] = [
	body('classId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({
				message: 'Invalid request.',
				errors: errors.array().map((e: ValidationError) => e.msg),
			});
		} else {
			try {
				const newPST = {
					owner: req.body.token.userId,
					org: req.body.token.org,
					class: req.body.classId,
				};

				const savedPST: PSTInterface | null = await PST.create(newPST);

				res.status(201).json(savedPST);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const add_student: RequestHandler[] = [
	body('pstId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({
				message: 'Invalid request.',
				errors: errors.array().map((e: ValidationError) => e.msg),
			});
		} else {
			try {
				const pstExists : PSTInterface | null = await PST.findOne({_id: req.params.pstId});

				if(!pstExists) {
					res.status(404).json({message: "PST Document not found."})
				} else {
					const updatedPST : PSTInterface | null = await PST.findOneAndUpdate(
						{_id: req.params.pstId},
						{'header.student': req.body.studentId},
						{new: true}
					)

					res.json(updatedPST);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

export default {
	get_pst_instance,
	get_user_pst,
	get_org_pst,
	get_class_pst,
	get_student_pst,
	create_pst,
	add_student,
};
