import Student, { StudentInterface } from "./../models/studentModel.js";
import Incident from "./../models/docTypes/incidentModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { RequestHandler } from "express";
import { Result, body, param, validationResult } from "express-validator";

const get_student_info: RequestHandler[] = [
	param("studentId")
		.trim()
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid request." })
		} else {
			try {
				const studentExists: StudentInterface | null = await Student.findOne({ _id: req.params.studentId }).populate("classes").lean().exec();

				if (!studentExists) {
					res.status(404).json({ message: "Student not found." })
				} else {
					res.status(200).json({ student: studentExists });
				}
			} catch (error) {
				next(error)
			}
		}
	})
];



export default { get_student_info };

