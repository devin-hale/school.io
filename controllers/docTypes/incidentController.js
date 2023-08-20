import Incident from "./../../models/docTypes/incidentModel.js";
import User from "./../../models/userModel.js";
import Student from "./../../models/studentModel.js";
import { body, validationResult } from "express-validator";
import asyncHandler from "express-async-handler";

// POST :: Redirect to incident record creation form
const populate_incident_creation_form = [
	body("teacherId").escape(),
	body("studentId").escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			//TODO: Replace with relevant URL.
			res.render("./../views/docTypes/incident/incidentResult.ejs", {
				message: "Error creating incident record.",
			});
		} else {
			const teacherExists = await User.findOne({
				_id: req.params.userId,
			}).exec();
			const studentExists = await Student.findOne({
				_id: req.params.studentId,
			}).exec();
			console.log(studentExists);

			if (!teacherExists || !studentExists) {
				//TODO: Replace with relevant URL.
				res.render("./../views/docTypes/incident/incidentResult.ejs", {
					message: "Error locating student and/or teacher data.",
				});
			} else {
				res.render("./../views/docTypes/incident/createIncident.ejs", {
					user: req.user,
					student: studentExists,
				});
			}
		}
	}),
];

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

export default {
	populate_incident_creation_form,
	create_incident_record,
	update_incident_record,
	delete_incident_record,
};
