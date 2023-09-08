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
    param("orgCode", "Invalid organization code")
        .trim()
        .isLength({ min: 6 })
        .escape(),

    asyncHandler(async (req, res, next): Promise<void> => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ message: "Invalid request." })
        } else {
            try {
                const findOrg = await Org.findOne({ orgCode: req.params.orgCode }).lean().exec();

                if (!findOrg) {
                    res.status(404).json({ message: "Organization not found." })
                } else {
                    res.status(200).json({ org: findOrg })
                }
            } catch (error) {
                next(error)
            };
        };
    }),
];

const edit_org_info: RequestHandler[] = [
    body("name")
        .optional()
        .trim()
        .escape(),
    param("orgId")
        .trim()
        .escape(),

    asyncHandler(async (req, res, next): Promise<void> => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ message: "Invalid request." })
        } else {
            try {
                const editedOrg : OrgInterface | null = await Org.findOneAndUpdate({_id: req.params.orgId}, req.body, {new: true})

                res.status(200).json({updatedOrg: editedOrg})
            } catch (error) {
                next(error)
            }
        }
    })
];

const edit_org_color: RequestHandler[] = [
    body("color")
        .optional()
        .trim()
        .escape(),
    param("orgId")
        .trim()
        .escape(),

    asyncHandler(async (req, res, next): Promise<void> => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ message: "Invalid request." })
        } else {
            try {
                const editedOrg : OrgInterface | null = await Org.findOneAndUpdate({_id: req.params.orgId}, {color: req.body.color}, {new: true})

                res.status(200).json({updatedOrg: editedOrg})
            } catch (error) {
                next(error)
            }
        }
    })
];

const delete_org: RequestHandler[] = [
	param("orgId")
		.trim()
		.escape(),

	asyncHandler(async(req, res, next): Promise<void> => {
		const errors : Result = validationResult(req);

		if(!errors.isEmpty()) {
            res.status(400).json({ message: "Invalid request." })
		} else {
			try {
				await Org.findOneAndDelete({_id: req.params.orgId}).exec();

				res.json({message: "Organization deleted successfully."})
			} catch (error) {
				next(error)
			}
		}
	})
]

export default { search_orgs, get_org_instance, create_org, org_code_verify, edit_org_info, edit_org_color, delete_org };
