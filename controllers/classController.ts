import { RequestHandler } from "express";
import mongoose, { Document } from "mongoose";
import ClassModel, { ClassInterface } from "./../models/classModel.js";
import asyncHandler from "express-async-handler";
import createError from 'http-errors';

const get_class_instance: RequestHandler = asyncHandler(async (req, res, next): Promise<void> => {
	try {
		const classInstance: ClassInterface | null = await ClassModel.findOne({ _id: req.params.classId })
			.populate("teachers")
			.lean()
			.exec()
		if (classInstance) {
			res.json({ classInstance: classInstance })
		} else {
			res.status(404).json({ message: "Class not found." })
		}
	} catch (err) {
		next(err);
	}
})

const get_user_classes: RequestHandler = asyncHandler(async (req, res, next) => {
	try {
		const classes: ClassInterface[] | undefined[] = await ClassModel.find({ teachers: req.params.userId })
			.lean()
			.populate("teachers")
			.exec();

		res.json({ classes: classes });

	} catch (err) {
		next(err);
	}
});

const get_org_classes: RequestHandler = asyncHandler(async (req, res, next): Promise<void> => {
	try {
		const classes: ClassInterface[] | undefined[] = await ClassModel.find({ org: req.params.orgId })
			.lean()
			.exec();
		res.json({ classes: classes });
	} catch (err) {
		next(err)
	}
})

const create_class: RequestHandler = asyncHandler(async (req, res): Promise<void> => {
	try {
		const newClass: Document = new ClassModel({
			name: req.body.name,
			grade_level: req.body.grade_level,
			subject: req.body.subject,
			teachers: req.body.teachers,
			org: req.body.org
		})

		const savedClass: Document | null = await newClass.save();
		if (savedClass) {
			res.status(201).json({ message: `Organization \"${req.body.name}\" was successfully created.`, content: savedClass })
		}
	} catch (error) {
		res.status(400).json({ message: "Invalid parameters." })
	}
})

const edit_class: RequestHandler = asyncHandler(async (req, res, next): Promise<void> => {
	try {
		const editedClass: ClassInterface | null = await ClassModel.findOneAndUpdate({ _id: req.params.classId }, req.body, { new: true })
		res.status(200).json({ message: "Class information edited.", content: editedClass })
	} catch (error) {
		next(error)
	}
})

const add_teacher: RequestHandler = asyncHandler(async (req, res, next): Promise<void> => {
	try {
		const editedClass: ClassInterface | null = await ClassModel.findOneAndUpdate({ _id: req.params.classId }, { $push: { teachers: req.body._id } }, { new: true })
		res.status(200).json({ message: "Teacher added to class.", content: editedClass })
	} catch (error) {
		next(error)
	}

})

const remove_teacher: RequestHandler = asyncHandler(async (req, res, next): Promise<void> => {
	const targetId = new mongoose.Types.ObjectId(`${req.body._id}`)
	try {
		const editedClass: ClassInterface | null = await ClassModel.findOneAndUpdate({ _id: req.params.classId }, { $pull: { teachers: targetId } }, { safe: true, new: true })
		res.status(200).json({ message: "Teacher removed from class.", content: editedClass })
	} catch (error) {
		next(error)
	}
})

const delete_class: RequestHandler = asyncHandler(async (req, res, next): Promise<void> => {
	const targetId = req.params.classId;

	try {
		const classExists: ClassInterface | null = await ClassModel.findById({ _id: targetId });

		if (classExists) {
			const deletedClass : Document | null = await ClassModel.findOneAndDelete({ _id: targetId });
			res.status(200).json({ message: "Class deleted from database.", content: deletedClass });
		} else {
			res.status(404).json({ message: "Class not found." })
		}
	} catch (error) {
		next(error)
	}
})

export default { get_class_instance, get_user_classes, get_org_classes, create_class, edit_class, add_teacher, remove_teacher, delete_class };
