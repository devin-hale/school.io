import { RequestHandler } from "express";
import Org, { OrgInterface } from "./../models/orgModel.js";
import asyncHandler from "express-async-handler";
import { body, param, query, validationResult, Result } from "express-validator";

const search_orgs: RequestHandler[] = [
	query("orgName")
		.trim()
		.toLowerCase()
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid request." })
		} else {
			try {
				const searchReg: RegExp = new RegExp(`${req.query.orgName}`, 'i');

				const searchResults: OrgInterface[] = await Org.find({ name: searchReg }).lean().exec();

				res.status(200).json({ searchResults: searchResults })
			} catch (error) {
				next(error)
			}
		}
	})
]

const get_org_instance: RequestHandler[] = [
	param("orgId")
		.trim()
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid request." })
		} else {
			try {
				const findOrg: OrgInterface | null = await Org.findOne({ _id: req.params.orgId }).lean().exec();

				if (!findOrg) {
					res.status(404).json({ message: "Organization not found." })
				} else {
					res.status(200).json({ org: findOrg });
				}

			} catch (errors) {
				next(errors)
			};
		};
	})

];

const create_org: RequestHandler[] = [
	body("name", "Invalid name.")
		.trim()
		.isLength({ min: 3 })
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid request." })
		} else {
			try {
				const newOrg = new Org({
					name: req.body.name,
				});

				const savedOrg: OrgInterface | null = await newOrg.save();

				res.status(201).json({ message: 'Org created successfully.', org: savedOrg })
			} catch (error) {
				next(error)
			}
		};
	})
];

const org_code_verify: RequestHandler[] = [
	body("orgCode", "Invalid organization code")
		.trim()
		.toLowerCase()
		.isLength({ min: 6 })
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid request." })
		} else {
			try {
				const findOrg = Org.findOne({ orgCode: req.body.orgCode }).lean().exec();

				if (!findOrg) {
					res.status(404).json({ message: "Organization not found." })
				} else {
					res.status(200).json({ organization: findOrg })
				}
			} catch (error) {
				next(error)
			};
		};
	}),
];

export default { search_orgs, get_org_instance, create_org, org_code_verify };
