import Class from "./../models/classModel.js";
import asyncHandler from "express-async-handler";
import Student from "./../models/studentModel.js";
import mongoose from "mongoose";
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
	const students = await Student.aggregate([
		{
			$match: { classes: { $in: [new mongoose.Types.ObjectId(`${classId}`)] } },
		},
		{
			$lookup: {
				from: "incidents",
				localField: "_id",
				foreignField: "students_involved",
				as: "allIncidents",
			},
		},
		{
			$project: {
				first_name: 1,
				last_name: 1,
				grade_level: 1,
				retained: 1,
				sped: 1,
				english_language_learner: 1,
				classes: 1,
				incidents: { $size: "$allIncidents" },
			},
		},
		{
			$sort: {
				last_name: 1,
			},
		},
	]).exec();

	res.render("./../views/class/classInstance.ejs", {
		user: req.user,
		classInfo: classInfo,
		students: students,
	});
});

export default { classes_page, class_instance_page };
