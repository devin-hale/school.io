import Class from "./../models/classModel.js";
import asyncHandler from "express-async-handler";
import Student from "./../models/studentModel.js";
import { body, validationResult } from "express-validator";

//GET :: Class home page
const classes_page = asyncHandler(async (req, res, next) => {
	const Classes = await Class.find({ teachers: req.user._id })
		.lean()
		.populate("teachers")
		.exec();

	res.render("./../views/class/class.ejs", {
		user: req.user,
		classes: Classes,
	});
});

//GET :: Specific Class Page
const class_instance_page = asyncHandler(async (req, res, next) => {
	const classId = req.params._id;
	const classInfo = await Class.findOne({ _id: classId })
		.populate("teachers")
		.exec();
	const students = await Student.find({ classes: { $in: [classId] } })
		.sort({ last_name: 1 })
		.lean()
		.exec();

	res.render("./../views/class/classInstance.ejs", {
		user: req.user,
		classInfo: classInfo,
		students: students,
	});
});

export default { classes_page, class_instance_page };
