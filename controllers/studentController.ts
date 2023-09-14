import Student, { StudentInterface } from "./../models/studentModel.js";
import Incident from "./../models/docTypes/incidentModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { RequestHandler } from "express";
import { Result, body, param, query, validationResult } from "express-validator";
import ClassModel, { ClassInterface } from "../models/classModel.js";

const search_student: RequestHandler[] = [
	query("name")
		.optional()
		.toLowerCase()
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid request." })
		} else {
			try {
				const splitName: string[] = req.query.name!.toString().split(" ")

				const firstName: RegExp = new RegExp(splitName[0], 'i')
				const lastName: RegExp = new RegExp(splitName[1], 'i')

				let searchStudentResults: StudentInterface[] = await Student.find({ $or: [{ first_name: firstName }, { last_name: lastName }] }).populate("classes").lean().exec();

				if (req.body.token.accType == "Basic" || req.body.tokenAccType == "Admin") searchStudentResults = searchStudentResults.filter(stu => stu.org == req.body.token.org)

				res.status(200).json(searchStudentResults);

			} catch (error) {
				next(error)
			}
		}
	})
]

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
				let studentExists: StudentInterface | null = await Student.findOne({ _id: req.params.studentId }).populate("classes").lean().exec();
				if (req.body.token.accType == "Basic" || req.body.tokenAccType == "Admin") {
					req.body.token.org == studentExists?.org ?
						res.status(404).json({ message: "Student not found." })
						: null
				}

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

const get_org_students: RequestHandler[] = [
	param("orgId")
		.trim()
		.escape(),

	asyncHandler(async (req, res, next) => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid request." })
		} else {
			try {

				let studentArr: StudentInterface[] = await Student.find({ org: req.params.orgId }).populate("classes").lean().exec();


				if (req.body.token.accType == "Basic" || req.body.tokenAccType == "Admin") studentArr = studentArr.filter(stu => stu.org == req.body.token.org)

				res.status(200).json(studentArr);

			} catch (error) {
				next(error)
			}
		}
	})
];

const get_class_students: RequestHandler[] = [
	param("classId")
		.trim()
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid rquest." })
		} else {
			try {
				let studentArr: StudentInterface[] = await Student.find({ classes: req.params.classId }).populate("classes").lean().exec();


				if (req.body.token.accType == "Basic" || req.body.tokenAccType == "Admin") studentArr = studentArr.filter(stu => stu.org == req.body.token.org)

				res.json(studentArr);

			} catch (error) {
				next(error)
			}
		}
	})
];

const create_student: RequestHandler[] = [
	body("first_name")
		.isString()
		.trim()
		.escape(),
	body("last_name")
		.isString()
		.trim()
		.escape(),
	body("grade_level")
		.isNumeric()
		.escape(),
	body("gifted")
		.isBoolean()
		.escape(),
	body("retained")
		.isBoolean()
		.escape(),
	body("sped")
		.isBoolean()
		.escape(),
	body("english_language_learner")
		.isBoolean()
		.escape(),
	body("org")
		.trim()
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid rquest." })
		} else {
			try {
				const newStudent = new Student({
					first_name: req.body.first_name,
					last_name: req.body.last_name,
					grade_level: req.body.grade_level,
					gifted: req.body.gifted,
					retained: req.body.retained,
					sped: req.body.sped,
					english_language_learner: req.body.english_language_learner,
					classes: req.body.classes,
					org: req.body.org
				})

				const savedStudent = await newStudent.save();

				res.status(201).json(savedStudent);
			} catch (error) {
				next(error)
			}
		}
	})
];

const edit_student_info: RequestHandler[] = [
	body("first_name")
		.optional()
		.isString()
		.trim()
		.escape(),
	body("last_name")
		.optional()
		.isString()
		.trim()
		.escape(),
	body("grade_level")
		.optional()
		.isNumeric()
		.escape(),
	body("gifted")
		.optional()
		.isBoolean()
		.escape(),
	body("retained")
		.optional()
		.isBoolean()
		.escape(),
	body("sped")
		.optional()
		.isBoolean()
		.escape(),
	body("english_language_learner")
		.optional()
		.isBoolean()
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid rquest." })
		} else {
			try {
				const studentExists: StudentInterface | null = await Student.findOne({ _id: req.params.studentId }).lean().exec();

				if (!studentExists) {
					res.status(404).json({ message: "ERROR: Student not found." })
				} else {
					const editInfo: object = {
						first_name: req.body.first_name || studentExists.first_name,
						last_name: req.body.last_name || studentExists.last_name,
						grade_level: req.body.grade_level || studentExists.grade_level,
						gifted: req.body.gifted || studentExists.gifted,
						retained: req.body.retained || studentExists.retained,
						sped: req.body.sped || studentExists.sped,
						english_language_learner: req.body.english_language_learner || studentExists.english_language_learner
					}

					const updatedStudent: StudentInterface | null = await Student.findOneAndUpdate({ _id: req.params.studentId }, editInfo, { new: true })


					res.json(updatedStudent)
				}
			} catch (error) {
				next(error)
			}
		}
	})
];

const student_add_class: RequestHandler[] = [
	param("studentId")
		.trim()
		.escape(),
	param("classId")
		.trim()
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid request." })
		} else {
			try {
				const studentExists: StudentInterface | null = await Student.findOne({ _id: req.params.studentId }).exec();
				const classExists: ClassInterface | null = await ClassModel.findOne({ _id: req.params.classId }).lean().exec();

				if (!studentExists || !classExists) {
					res.status(404).json({ message: "Cannot find information." })
				} else {
					const updatedStudent: StudentInterface | null = await Student.findOneAndUpdate({ _id: req.params.studentId }, { $push: { classes: req.params.classId } }, { new: true });


					res.json({ message: "Success." })
				}


			} catch (error) {
				next(error)
			}
		}
	})
];
const student_remove_class: RequestHandler[] = [
	param("studentId")
		.trim()
		.escape(),
	param("classId")
		.trim()
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid request." })
		} else {
			try {
				const classExists: ClassInterface | null = await ClassModel.findOne({ _id: req.params.classId }).lean().exec();
				const studentExists: StudentInterface | null = await Student.findOne({ _id: req.params.studentId, classes: classExists?._id }).exec();


				if (!studentExists || !classExists) {
					res.status(404).json({ message: "Cannot student in specificed class." })
				} else {
					await Student.findOneAndUpdate({ _id: req.params.sudentId }, { $pull: { classes: req.params.classId } })

					res.json({ message: "Success." })
				}


			} catch (error) {
				next(error)
			}
		}
	})
];

const toggle_active: RequestHandler[] = [
	param("studentId")
		.trim()
		.escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: "Invalid request." })
		} else {
			try {
				const studentExists: StudentInterface | null = await Student.findOne({ _id: req.params.studentId }).exec();


				if (!studentExists) {
					res.status(404).json({ message: "Student not found." })
				} else {
					const updateValue: boolean = !studentExists.active;
					await Student.findOneAndUpdate({ _id: req.params.sudentId }, { active: updateValue })

					res.json({ message: "Success." })
				}


			} catch (error) {
				next(error)
			}
		}
	})
];

export default {
	search_student, get_student_info, get_org_students, get_class_students, create_student, edit_student_info, student_add_class,
	student_remove_class, toggle_active
};

