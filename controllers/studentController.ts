import Student, { StudentInterface } from "./../models/studentModel.js";
import Incident from "./../models/docTypes/incidentModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { RequestHandler } from "express";
import { Result, body, param, query, validationResult } from "express-validator";

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

const create_student: RequestHandlerp[] = [
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
	body("classes")
		.isArray()
		.escape(),
	body("org")
		.trim()
		.escape(),

	asyncHandler(async(req, res, next): Promise<void> => {
		const errors : Result = validationResult(req);

		if(!errors.isEmpty()) {
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






]


export default { search_student, get_student_info, get_org_students, get_class_students, create_student };

