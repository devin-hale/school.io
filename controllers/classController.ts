import ClassModel from "./../models/classModel.js";
import asyncHandler from "express-async-handler";
import createError from 'http-errors';

const get_class_instance = asyncHandler(async(req, res, next)=> {
    const classInstance = await ClassModel.findOne({_id: req.params.classId})
        .populate("teachers")
        .lean()
        .exec()
    if(classInstance) {
        res.json({classInstance: classInstance})
    } else {
        next()
    }
})

const get_user_classes = asyncHandler(async (req, res) => {
	const classes = await ClassModel.find({ teachers: req.params.userId})
		.lean()
		.populate("teachers")
		.exec();
    
    res.json({classes: classes});
});

const get_org_classes = asyncHandler(async (req, res)=> {
    const classes = await ClassModel.find({org: req.params.orgId})
        .lean()
        .exec();
    res.json({classes: classes});
})

const create_class = asyncHandler(async (req, res, next) => {
    const newClass = new ClassModel({
        name: req.body.name,
        grade_level: req.body.grade_level,
        subject: req.body.subject,
        teachers: req.body.teachers, 
        org: req.body.org
    })

    const savedClass = await newClass.save();

    if(savedClass) {
        res.status(201).json({message: `Organization \"${req.body.name}\" was successfully created.`, content: savedClass})
    } else {
        res.send(createError(400))
    }
})


export default {get_class_instance, get_user_classes, get_org_classes, create_class};
