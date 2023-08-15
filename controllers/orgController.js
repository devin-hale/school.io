import Org from "./../models/orgModel.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

//GET :: Return org info as JSON
const org_info = asyncHandler(async (req, res, next) => {
	const org = Org.findOne({ name: req.body.name }).exec();
	res.json({ message: org });
});

//POST :: Create Organization
const org_create = [
	//Sanitize
	body("name", "Invalid name.")
		.trim()
		.toLowerCase()
		.isLength({ min: 3 })
		.escape(),

	//Create Org
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			//TODO :: Re-Render with Error
		} else {
			//Org Name is Valid
			const newOrg = new Org({
				name: req.body.name,
			});

			await newOrg.save();
			//TODO :: Render logic
		}
	}),
];

//POST :: Verify that org Code Exists
const org_code_verify = [
	//Sanitize
	body("orgCode", "Invalid organization code")
		.trim()
		.toLowerCase()
		.isLength({ min: 6 })
		.escape(),

	//Operations
	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render("./../views/accountCreate/verifyOrg.ejs", {
				message: "Invalid organization code.",
			});
		} else {
			const findOrg = Org.findOne({ orgCode: req.body.orgCode });

			if (!findOrg) {
				res.render("./../views/accountCreate/verifyOrg.ejs", {
					message: "No organization with that code was found.",
				});
			} else {
				res.render("./../views/accountCreate/createAccount.ejs", {
					message: "",
					orgCode: req.body.orgCode,
				});
			}
		}
	}),
];

export default { org_info, org_code_verify };
