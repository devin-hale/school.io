import Student from "./../../models/studentModel.js";
import User from "./../../models/userModel.js";
import Communication from "./../../models/docTypes/comModel.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

// POST :: Create communication record
const create_communication_record = [
	//Sanitize
	body("owner").escape(),
	body("access").escape(),
	body("communication_type").escape(),
	body("date_of_occurence").escape(),
	body("staff_involved").escape(),
	body("students_involved").escape(),
	body("parents_involved").escape(),
	body("other_involved").escape(),
	body("subject").trim().escape(),
	body("description").trim().escape(),
	body("followUp").escape(),
	body("followUp_date").escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render("./../views/index.js", {
				message: "Error creating communication record.",
			});
		} else {
			const newRecord = new Communication({
				owner: req.body.owner,
				access: req.body.access,
				communication_type: req.body.communication_type,
				date_of_occurence: req.body.communication_type,
				staff_involved: req.body.staff_involved,
				students_involved: req.body.students_involved,
				parents_involved: req.body.parents_involved,
				other_involved: req.body.other_involved,
				subject: req.body.subject,
				description: req.body.description,
				followUp: req.body.followUp,
				followUp_date: req.body.followUp_date,
			});

			await newRecord.save();

			//TODO: Create success page or some place to re-render.
			res.redirect("/classes");
		}
	}),
];

//PUT :: Edit record
const edit_communication_record = [
	//Sanitize
	body("owner").escape(),
	body("access").escape(),
	body("communication_type").escape(),
	body("date_of_occurence").escape(),
	body("staff_involved").escape(),
	body("students_involved").escape(),
	body("parents_involved").escape(),
	body("other_involved").escape(),
	body("subject").trim().escape(),
	body("description").trim().escape(),
	body("followUp").escape(),
	body("followUp_date").escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.render("./../views/index.js", {
				message: "Error creating communication record.",
			});
		} else {
			const recordExists = Communication.findbyId(req.body.commId).exec();

			if (!recordExists) {
			} else {
				const editRecord = new Communication({
					owner: req.body.owner,
					access: req.body.access,
					communication_type: req.body.communication_type,
					date_of_occurence: req.body.communication_type,
					staff_involved: req.body.staff_involved,
					students_involved: req.body.students_involved,
					parents_involved: req.body.parents_involved,
					other_involved: req.body.other_involved,
					subject: req.body.subject,
					description: req.body.description,
					followUp: req.body.followUp,
					followUp_date: req.body.followUp_date,
				});

				await Communication.findByIdAndUpdate(req.body.commId, editRecord);

				//TODO: Create success page or some place to re-render.
				res.redirect("/classes");
			}
		}
	}),
];

//DELETE :: Delete Comm Record

const delete_communication_record = [
	//Sanitize
	body("commId").trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			//CHANGE RENDER URL
			res.render("./../views/index.js", {
				message: "Error deleting communication record.",
			});
		} else {
			const commExists = await Communication.findOne({ _id: req.body.commId });

			if (!commExists) {
				//CHANGE RENDER URL
				res.render("./../views/index.js", {
					message: "Error: Communication record not found.",
				});
			} else {
				await commExists.remove().exec();

				//TODO: Create success page or some place to re-render.
				res.redirect("/classes");
			}
		}
	}),
];

export default {
	create_communication_record,
	edit_communication_record,
	delete_communication_record,
};
