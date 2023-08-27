import ClassModel from "./../models/classModel.js";
import asyncHandler from "express-async-handler";

const get_user_classes = asyncHandler(async (req, res) => {
    console.log(req.params.userId)
	const classes = await ClassModel.find({ teachers: Number(req.params.userId)})
		.lean()
		.populate("teachers")
		.exec();
    console.log(classes) 
    res.json({classes: classes});
});


export default {get_user_classes };
