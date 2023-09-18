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

export default {
	get_pst_instance,
	get_user_pst,
	get_org_pst,
	get_class_pst,
};
