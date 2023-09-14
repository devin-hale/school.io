import Incident, { IncidentInterface } from "./../../models/docTypes/incidentModel.js";
import User from "./../../models/userModel.js";
import Student from "./../../models/studentModel.js";
import { body, param, validationResult, Result } from "express-validator";
import asyncHandler from "express-async-handler";
import { RequestHandler } from "express";

const get_incident: RequestHandler[] = [
	param("incidentId")
		.trim()
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid request." })
		} else {
			try {
				const incidentExists: IncidentInterface | null = await Incident.findOne({ _id: req.params.incidentId }).lean().exec();

				if (!incidentExists) {
					res.status(400).json({ message: "Invalid request." })
				} else {
					res.json(incidentExists);
				}
			} catch (error) {
				next(error)
			}
		}

	})
]

// POST :: Create incident record

const create_incident_record = [
	//Sanitize
	body("owner").trim().escape(),
	body("access").trim().optional({ checkFalsy: true }).escape(),
	body("students_involved").trim().optional({ checkFalsy: true }).escape(),
	body("date_of_occurence").trim().escape(),
	body("staff_involved").trim().optional({ checkFalsy: true }).escape(),
	body("parents_involved").trim().optional({ checkFalsy: true }).escape(),
	body("others_involved").trim().optional({ checkFalsy: true }).escape(),
	body("subject").trim().escape(),
	body("description").trim().escape(),
	body("action_taken").trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			//TODO: Replace with relevant URL.
			res.render("./../views/docTypes/incident/incidentResult.ejs", {
				user: req.user,
				message: "Error creating incident record.",
			});
		} else {
			const newRecord = new Incident({
				owner: req.body.owner,
				access: req.body.access,
				date_of_occurence: req.body.date_of_occurence,
				students_involved: req.body.students_involved,
				staff_involved: req.body.staff_involved,
				parents_involved: req.body.parents_involved,
				others_involved: req.body.others_involved,
				subject: req.body.subject,
				description: req.body.description,
				action_taken: req.body.action_taken,
				parentOrGuardian_notified: req.body.parentOrGuardian_notified,
				escalated: req.body.escalated,
			});

			await newRecord.save();

			res.render("./../views/docTypes/incident/incidentResult.ejs", {
				user: req.user,
				message: "Incident record created successfully.",
			});
		}
	}),
];

//PUT :: Update incident.

const update_incident_record = [
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
				res.render("./../views/docTypes/incident/createIncident.ejs");
			}
		}
	}),
];




export default {
	get_incident,
	create_incident_record,
	update_incident_record,
};
