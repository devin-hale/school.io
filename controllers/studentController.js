import Student from "./../models/studentModel.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

const student_details_page = asyncHandler(async (req, res, next) => {
	const studentID = req.params.id;
	const student = await Student.findOne({ _id: studentID })
		.populate("classes")
		.exec();
	console.log(studentID);
	console.log(student);
	//TODO (later) Grab all incidents with this studentID as a ref, pass it into render.

	res.render("./../views/student/studentDetails.ejs", {
		user: req.user,
		student: student,
	});
});

export default { student_details_page };