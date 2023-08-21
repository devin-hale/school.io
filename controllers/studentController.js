import Student from "./../models/studentModel.js";
import Incident from "./../models/docTypes/incidentModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";

const student_details_page = asyncHandler(async (req, res, next) => {
	const studentID = req.params.id;
	const student = await Student.findOne({ _id: studentID })
		.populate("classes")
		.exec();
	const incidents = await Incident.find({
		students_involved: {
			$in: [new mongoose.Types.ObjectId(`${studentID}`)],
		},
	})
		.sort({
			date_of_occurence: -1,
		})
		.populate("owner")
		.lean()
		.exec();

	res.render("./../views/student/studentDetails.ejs", {
		user: req.user,
		student: student,
		documentation: {
			incidents: incidents,
		},
	});
});

export default { student_details_page };
