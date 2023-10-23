import Student, { StudentInterface } from './../models/studentModel.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { RequestHandler } from 'express';
import {
	Result,
	body,
	param,
	query,
	validationResult,
} from 'express-validator';
import ClassModel, { ClassInterface } from '../models/classModel.js';
import pstModel from '../models/docTypes/pstModel.js';
import { Payload } from './utils/payload.js';

const search_student: RequestHandler[] = [
	query('name').optional().toLowerCase().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const splitName: string[] = req.query.name!.toString().split(' ');

				const firstName: RegExp = new RegExp(splitName[0], 'i');
				const lastName: RegExp = new RegExp(splitName[1], 'i');

				let searchStudentResults: StudentInterface[] = await Student.find({
					$or: [{ first_name: firstName }, { last_name: lastName }],
				})
					.populate('classes')
					.lean()
					.exec();

				if (
					req.body.token.accType == 'Basic' ||
					req.body.tokenAccType == 'Admin'
				)
					searchStudentResults = searchStudentResults.filter(
						(stu) => stu.org == req.body.token.org
					);

				res.json(new Payload('Search complete.', 200, searchStudentResults));
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_student_info: RequestHandler[] = [
	param('studentId').trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				let studentExists: StudentInterface | null = await Student.findOne({
					_id: req.params.studentId,
				})
					.populate('classes')
					.lean()
					.exec();

				if (!studentExists) {
					res.status(404).json(new Payload(`Student ${req.params.studentId} not found.`, 404, null))
				} else {
					res
						.status(200)
						.json(
							new Payload(
								`Retrieved info for student ${req.params.studentId}`,
								200,
								studentExists
							)
						);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_org_students: RequestHandler[] = [
	param('orgId').trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				let studentArr: StudentInterface[] = await Student.find({
					org: req.params.orgId,
				})
					.populate('classes')
					.lean()

				if (
					req.body.token.accType == 'Basic' ||
					req.body.tokenAccType == 'Admin'
				)
					studentArr = studentArr.filter(
						(stu) => stu.org == req.body.token.org
					);
				res.json(
					new Payload(
						`Retrieved students for organization ${req.params.orgId}`,
						200,
						studentArr
					)
				);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_class_students: RequestHandler[] = [
	param('classId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid rquest.' });
		} else {
			try {
				let studentArr: StudentInterface[] = await Student.find({
					classes: req.params.classId,
				})
					.populate('classes')
					.lean()
					.exec();

				if (
					req.body.token.accType == 'Basic' ||
					req.body.tokenAccType == 'Admin'
				)
					studentArr = studentArr.filter(
						(stu) => stu.org == req.body.token.org
					);

				res.json(
					new Payload(
						`Retrieved students for class ${req.params.classId}`,
						200,
						studentArr
					)
				);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const create_student: RequestHandler[] = [
	body('first_name').isString().trim(),
	body('last_name').isString().trim(),
	body('grade_level'),
	body('gifted').isBoolean(),
	body('retained').isBoolean(),
	body('sped').isBoolean(),
	body('english_language_learner').isBoolean(),
	body('org'),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid rquest.' });
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
					org: req.body.org,
				});

				const savedStudent = await newStudent.save();

				if (savedStudent) {
					res
						.status(201)
						.json(
							new Payload('Student saved successfully.', 201, savedStudent)
						);
				} else {
					res
						.status(500)
						.json(new Payload('ERROR: Saving student failed.', 500, null));
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const edit_student_info: RequestHandler[] = [
	body('first_name').optional().isString().trim(),
	body('last_name').optional().isString().trim(),
	body('grade_level').optional().isNumeric(),
	body('gifted').optional().isBoolean(),
	body('retained').optional().isBoolean(),
	body('sped').optional().isBoolean(),
	body('english_language_learner').optional().isBoolean(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid rquest.' });
		} else {
			try {
				const studentExists: StudentInterface | null = await Student.findOne({
					_id: req.params.studentId,
				})
					.lean()
					.exec();

				if (!studentExists) {
					res.status(404).json(new Payload(`Student ${req.params.studentId} not found.`, 404, null))
				} else {
					const editInfo: object = {
						first_name: req.body.first_name || studentExists.first_name,
						last_name: req.body.last_name || studentExists.last_name,
						grade_level: req.body.grade_level || studentExists.grade_level,
						gifted: req.body.gifted,
						retained: req.body.retained,
						sped: req.body.sped,
						english_language_learner:
							req.body.english_language_learner,
					};

					const updatedStudent: StudentInterface | null =
						await Student.findOneAndUpdate(
							{ _id: req.params.studentId },
							editInfo,
							{ new: true }
						);

					if (!updatedStudent) {
						res
							.status(500)
							.json(
								new Payload(
									`Error saving student ${req.params.studentId}`,
									500,
									null
								)
							);
					} else {
						res.json(
							new Payload(
								`Updated student ${req.params.studentId} successfully`,
								200,
								updatedStudent
							)
						);
					}
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const transfer_student: RequestHandler[] = [
	param('studentId').trim().escape(),
	param('classId').trim().escape(),
	param('newClassId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const studentExists: StudentInterface | null = await Student.findOne({
					_id: req.params.studentId,
				}).exec();
				const classExists: ClassInterface | null = await ClassModel.findOne({
					_id: req.params.classId,
				});
				const newClassExists: ClassInterface | null = await ClassModel.findOne({
					_id: req.params.newClassId,
				});

				if (!studentExists || !classExists || !newClassExists) {
					res.status(404).json({ message: 'Cannot find information.' });
				} else {
					const session = await mongoose.connection.startSession();

					try {
						session.startTransaction();

						await Student.findOneAndUpdate(
							{ _id: req.params.studentId },
							{
								$pull: { classes: req.params.classId },
								$push: { classes: req.params.classId },
							},
							{ session }
						);

						await pstModel.updateMany(
							{
								'header.student': req.params.studentId,
								class: req.params.classId,
							},
							{
								class: req.params.newClassId,
							},
							{ session }
						);

						await session.commitTransaction();

						res.json(
							new Payload(`Student transferred successfully`, 200, null)
						);
					} catch (error) {
						await session.abortTransaction();
						res
							.status(500)
							.json(new Payload(`Error transferring student`, 500, null));
					}
					session.endSession();
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const student_add_class: RequestHandler[] = [
	param('studentId').trim().escape(),
	param('classId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const studentExists: StudentInterface | null = await Student.findOne({
					_id: req.params.studentId,
				}).exec();
				const classExists: ClassInterface | null = await ClassModel.findOne({
					_id: req.params.classId,
				})
					.lean()
					.exec();

				if (!studentExists || !classExists) {
					res.status(404).json({ message: 'Cannot find information.' });
				} else {
					const updatedStudent: StudentInterface | null =
						await Student.findOneAndUpdate(
							{ _id: req.params.studentId },
							{
								$push: { classes: req.params.classId },
							},
							{ new: true }
						);
					if (!updatedStudent) {
						res
							.status(500)
							.json(
								new Payload(
									`Error adding student ${req.params.studentId} to class ${req.params.classId}`,
									500,
									null
								)
							);
					} else {
						res.json(
							new Payload(
								`Student ${req.params.studentId} added to class ${req.params.classId}`,
								200,
								updatedStudent
							)
						);
					}
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];
const student_remove_class: RequestHandler[] = [
	param('studentId').trim().escape(),
	param('classId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const classExists: ClassInterface | null = await ClassModel.findOne({
					_id: req.params.classId,
				})
					.lean()
					.exec();
				const studentExists: StudentInterface | null = await Student.findOne({
					_id: req.params.studentId,
					classes: classExists?._id,
				}).exec();

				if (!studentExists || !classExists) {
					res
						.status(404)
						.json({ message: 'Cannot student in specificed class.' });
				} else {
					const updatedStudent: StudentInterface | null =
						await Student.findOneAndUpdate(
							{ _id: req.params.studentId },
							{ $pull: { classes: req.params.classId } }
						);

					if (!updatedStudent) {
						res
							.status(500)
							.json(
								new Payload(
									`Error removing student ${req.params.studentId} from class ${req.params.classId}`,
									500,
									null
								)
							);
					} else {
						res.json(
							new Payload(
								`Student ${req.params.studentId} removed from class ${req.params.classId}`,
								200,
								updatedStudent
							)
						);
					}
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const toggle_active: RequestHandler[] = [
	param('studentId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const studentExists: StudentInterface | null = await Student.findOne({
					_id: req.params.studentId,
				}).exec();

				if (!studentExists) {
					res.status(404).json(new Payload(`Student ${req.params.studentId} not found.`, 404, null))
				} else {
					const updateValue: boolean = !studentExists.active;
					const updatedStudent: StudentInterface | null =
						await Student.findOneAndUpdate(
							{ _id: req.params.studentId },
							{ active: updateValue }
						);

					if (!updatedStudent) {
						res
							.status(500)
							.json(
								new Payload(
									`Error toggling active status for student ${req.params.studentId}`,
									500,
									null
								)
							);
					} else {
						res.json(
							new Payload(
								`Student ${req.params.studentId} set to ACTIVE:${updatedStudent.active}`,
								200,
								updatedStudent
							)
						);
					}
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const delete_student: RequestHandler[] = [
	param('studentId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const studentExists: StudentInterface | null = await Student.findOne({
					_id: req.params.studentId,
				}).exec();
				if (!studentExists) {
					res.status(404).json(new Payload(`Student ${req.params.studentId} not found.`, 404, null))
				} else {
					await Student.findOneAndDelete({ _id: req.params.studentId }).exec();
					res.json(new Payload(`Student ${req.params.studentId} deleted.`, 200, null))
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

export default {
	search_student,
	get_student_info,
	get_org_students,
	get_class_students,
	create_student,
	edit_student_info,
	student_add_class,
	student_remove_class,
	toggle_active,
	delete_student,
	transfer_student,
};
