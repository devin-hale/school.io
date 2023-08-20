import Incident from "./../../models/docTypes/incidentModel.js";
import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";

// POST :: Create incident record

const create_incident_record = [
	//Sanitize
	body("owner").trim().escape(),
	body("access").trim().escape(),
	body("date_of_occurence").trim().escape(),
	body("staff_involved").trim().escape(),
	body("parents_involved").trim().escape(),
	body("others_involved").trim().escape(),
	body("subject").trim().escape(),
	body("description").trim().escape(),
	body("action_taken").trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			//TODO: Replace with relevant URL.
			res.render("./../views/inded.ejs", {
				message: "Error creating incident record.",
			});
		} else {
			const newRecord = new Incident({
				owner: req.body.owner,
				access: req.body.access,
				date_of_occurence: req.body.date_of_occurence,
				staff_involved: req.body.staff_involved,
				parents_involved: req.body.parents_involved,
				others_involved: req.body.others_involved,
				subject: req.body.subject,
				description: req.body.description,
				action_taken: req.body.action_taken,
			});

			await newRecord.save();

			//TODO: Replace with relevant URL/file.
			res.render("./../views/index.ejs");
		}
	}),
];

//PUT :: Update incident.

const update_incident_report = [
	body("_id").trim().escape(),
	body("owner").trim().escape(),
	body("access").trim().escape(),
	body("date_of_occurence").trim().escape(),
	body("staff_involved").trim().escape(),
	body("parents_involved").trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			//TODO: Replace with relevant URL.
			res.render("./../views/inded.ejs", {
				message: "Error creating incident record.",
			});
		} else {
			const recordExists = Incident.findById(req.body._id).exec();

			if (!recordExists) {
				res.render("./../views/inded.ejs", {
					message: "Error creating incident record.",
				});
			} else {
				const editRecord = {
					owner: req.body.owner,
					access: req.body.access,
					date_of_occurence: req.body.date_of_occurence,
					staff_involved: req.body.staff_involved,
					parents_involved: req.body.parents_involved,
					others_involved: req.body.others_involved,
					subject: req.body.subject,
					description: req.body.description,
					action_taken: req.body.action_taken,
				};

				await Incident.findByIdAndUpdate(req.body._id, editRecord);

				//TODO: Replace with relevant URL/file.
				res.render("./../views/index.ejs");
			}
		}
	}),
];

// DELETE ::

const delete_incident_record = [
	body("_id").escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			//CHANGE RENDER URL
			res.render("./../views/index.js", {
				message: "Error deleting incident record.",
			});
		} else {
			const incidentExists = await Incident.findOne({ _id: req.body._id });

			if (!incidentExists) {
				//CHANGE RENDER URL
				res.render("./../views/index.js", {
					message: "Error: Communication record not found.",
				});
			} else {
				await incidentExists.remove().exec();

				//TODO: Create success page or some place to re-render.
				res.redirect("/classes");
			}
		}
	}),
];
