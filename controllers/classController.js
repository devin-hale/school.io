import Class from "./../models/classModel.js";
import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";

//GET :: Class home page
const classes_page = asyncHandler(async (req, res, next) => {
	const Classes = await Class.find({ teachers: req.user._id }).lean().exec();
	console.log(Classes[0].url);

	res.render("./../views/class/class.ejs", {
		user: req.user,
		classes: [...Classes],
	});
});

//GET :: Specific Class Page
const class_instance_page = asyncHandler(async (req, res, next) => {
	const classId = req.params._id;
	const classInfo = await Class.findOne({ _id: classId });

	console.log(classInfo);

	res.render("./../views/class/classInstance.ejs", { classInfo: classInfo });
});

export default { classes_page, class_instance_page };
