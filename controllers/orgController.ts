import { RequestHandler } from 'express';
import Org, { OrgInterface } from './../models/orgModel.js';
import asyncHandler from 'express-async-handler';
import {
	body,
	param,
	query,
	validationResult,
	Result,
} from 'express-validator';

import { Payload } from './utils/payload.js';

const search_orgs: RequestHandler[] = [
	query('orgName').trim().toLowerCase().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const searchReg: RegExp = new RegExp(`${req.query.orgName}`, 'i');

				const searchResults: OrgInterface[] = await Org.find({
					name: searchReg,
				})
					.lean()
					.exec();

				res.json(new Payload(`Search complete.`, 200, searchResults));
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_org_instance: RequestHandler[] = [
	param('orgId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const findOrg: OrgInterface | null = await Org.findOne({
					_id: req.params.orgId,
				})
					.lean()
					.exec();

				if (!findOrg) {
					res
						.status(404)
						.json(
							new Payload(
								`Organization ${req.params.orgId} not found.`,
								404,
								null
							)
						);
				} else {
					res
						.status(200)
						.json(
							new Payload(
								`Retrieved organization ${req.params.orgId},`,
								200,
								findOrg
							)
						);
				}
			} catch (errors) {
				next(errors);
			}
		}
	}),
];

const create_org: RequestHandler[] = [
	body('name', 'Invalid name.').trim().isLength({ min: 3 }),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const newOrg = new Org({
					name: req.body.name,
				});

				const savedOrg: OrgInterface | null = await newOrg.save();

				if (!savedOrg) {
					res
						.status(500)
						.json(new Payload(`Error creating organization.`, 500, null));
				} else {
					res.status(201).json(
						new Payload(`Organization created succesfully.`, 201, savedOrg)
					);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const org_code_verify: RequestHandler[] = [
	param('orgCode', 'Invalid organization code')
		.trim()
		.isLength({ min: 6 })
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const findOrg = await Org.findOne({ orgCode: req.params.orgCode })
					.lean()
					.exec();

				if (!findOrg) {
					res.status(404).json({ message: 'Organization not found.' });
				} else {
					res.status(200).json({ org: findOrg });
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const edit_org_info: RequestHandler[] = [
	body('name').optional().trim(),
	param('orgId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const editedOrg: OrgInterface | null = await Org.findOneAndUpdate(
					{ _id: req.params.orgId },
					req.body,
					{ new: true }
				);

				if (!editedOrg) {
					res
						.status(500)
						.json(
							new Payload(
								`Error saving changes to org ${req.params.orgId}`,
								500,
								null
							)
						);
				} else {
					res.json(
						new Payload(
							`Org ${req.params.orgId} updated succesfully`,
							200,
							editedOrg
						)
					);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const edit_org_color: RequestHandler[] = [
	body('color').optional().trim(),
	param('orgId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const editedOrg: OrgInterface | null = await Org.findOneAndUpdate(
					{ _id: req.params.orgId },
					{ color: req.body.color },
					{ new: true }
				);

				if (!editedOrg) {
					res.status(500).json(new Payload(`Error saving changes.`, 500, null));
				} else {
					res.json(new Payload(`Changes saved.`, 200, editedOrg));
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const delete_org: RequestHandler[] = [
	param('orgId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const deletedOrg : OrgInterface | null = await Org.findOneAndDelete({ _id: req.params.orgId }).exec();

				if(!deletedOrg) {
					res.status(500).json(new Payload(`Error deleting organization ${req.params.orgId}`, 500, null))
				} else {
					res.json(new Payload(`Organization ${req.params.orgId} deleted.`, 200, deletedOrg))
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

export default {
	search_orgs,
	get_org_instance,
	create_org,
	org_code_verify,
	edit_org_info,
	edit_org_color,
	delete_org,
};
