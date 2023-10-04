import { RequestHandler } from 'express';
import mongoose, { Document, UpdateWriteOpResult } from 'mongoose';
import ClassModel, { ClassInterface } from './../models/classModel.js';
import {
	Result,
	body,
	param,
	query,
	validationResult,
} from 'express-validator';
import asyncHandler from 'express-async-handler';
import studentModel, { StudentInterface } from '../models/studentModel.js';
import { Payload } from './utils/payload.js';

const search_class: RequestHandler[] = [
	query('name').trim(),
	query('subject').trim(),
	query('teacher').trim(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				if (!req.query) {
					res.status(200).json({ searchResults: [] });
				} else {
					const nameQuery = new RegExp(`${req.query.name}`, 'i') || '';
					const subjectQuery = new RegExp(`${req.query.name}`, 'i') || '';
					let searchResults: any[] = await ClassModel.find({
						$or: [{ name: nameQuery }, { subject: subjectQuery }],
					})
						.populate('teachers')
						.populate('org')
						.lean()
						.exec();

					searchResults = searchResults.filter((classEl) => {
						return classEl.teachers?.some((teacher: any) =>
							`${teacher.first_name + teacher.last_name}`.match(
								new RegExp(`${req.query.teacher || ''}`, 'i')
							)
						);
					});

					if (
						req.body.token.accType == 'Basic' ||
						req.body.token.AccType == 'Admin'
					) {
						searchResults = searchResults.filter(
							(classResult) => classResult.org._id == req.body.token.org
						);
					}
					res
						.status(200)
						.json(new Payload(`Search complete.`, 200, searchResults));
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_class_instance: RequestHandler[] = [
	param('classId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const classInstance: ClassInterface | null = await ClassModel.findOne({
					_id: req.params.classId,
				})
					.populate('teachers')
					.lean()
					.exec();
				if (classInstance) {
					res.json(
						new Payload(
							`Retrieved class ${req.params.classId}`,
							200,
							classInstance
						)
					);
				} else {
					res
						.status(404)
						.json(
							new Payload(`Class ${req.params.classId} not found`, 404, null)
						);
				}
			} catch (err) {
				next(err);
			}
		}
	}),
];

const get_org_classes: RequestHandler[] = [
	param('orgId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const classes: ClassInterface[] | undefined[] = await ClassModel.find({
					org: req.params.orgId,
				})
					.lean()
					.exec();

				res.json(
					new Payload(
						`Retrieved classes for org ${req.params.orgId}`,
						200,
						classes
					)
				);
			} catch (err) {
				next(err);
			}
		}
	}),
];
const create_class: RequestHandler[] = [
	body('name').trim().isString().isLength({ min: 1, max: 30 }),
	body('grade_level').trim().isString().isLength({ min: 1, max: 10 }),
	body('subject').optional().trim().isString().isLength({ min: 1, max: 20 }),
	body('org').optional().isString().trim().isLength({ min: 1 }),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const newClass: Document = new ClassModel({
					name: req.body.name,
					grade_level: req.body.grade_level,
					subject: req.body.subject,
					teachers: req.body.teachers,
					org: req.body.org,
				});

				const savedClass: Document | null = await newClass.save();
				if (savedClass) {
					res
						.status(201)
						.json(new Payload(`Class created successfully.`, 201, savedClass));
				} else {
					res.status(500).json(new Payload(`Error creating class.`, 500, null));
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];
const edit_class: RequestHandler[] = [
	body('name').optional().trim().isString().isLength({ min: 1, max: 20 }),
	body('grade_level')
		.optional()
		.trim()
		.isString()
		.isLength({ min: 1, max: 10 }),
	body('subject').optional().trim().isString().isLength({ min: 1, max: 20 }),
	param('classId').trim().isLength({ min: 1 }),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const editedClass: ClassInterface | null =
					await ClassModel.findOneAndUpdate(
						{ _id: req.params.classId },
						req.body,
						{ new: true }
					);

				if (!editedClass) {
					res
						.status(500)
						.json(
							new Payload(
								`Error saving changes to class ${req.params.classId}`,
								500,
								null
							)
						);
				} else {
					res.json(
						new Payload(
							`Changes to class ${req.params.classId} saved successfully.`,
							200,
							editedClass
						)
					);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];
const add_teacher: RequestHandler[] = [
	param('classId').trim().isLength({ min: 1 }).escape(),
	body('_id').trim().isLength({ min: 1 }).escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors = validationResult(req);

		if (!errors.isEmpty) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const editedClass: ClassInterface | null =
					await ClassModel.findOneAndUpdate(
						{ _id: req.params.classId },
						{ $push: { teachers: req.body._id } },
						{ new: true }
					);

				if (!editedClass) {
					res
						.status(500)
						.json(
							new Payload(
								`Error saving changes to class ${req.params.classId}`,
								500,
								null
							)
						);
				} else {
					res.json(
						new Payload(
							`Changes to class ${req.params.classId} saved successfully.`,
							200,
							editedClass
						)
					);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];
const remove_teacher: RequestHandler[] = [
	param('classId').trim().isLength({ min: 1 }).escape(),
	body('_id').trim().isLength({ min: 1 }).escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			const targetId = new mongoose.Types.ObjectId(`${req.body._id}`);
			try {
				const editedClass: ClassInterface | null =
					await ClassModel.findOneAndUpdate(
						{ _id: req.params.classId },
						{ $pull: { teachers: targetId } },
						{ safe: true, new: true }
					);
				if (!editedClass) {
					res
						.status(500)
						.json(
							new Payload(
								`Error saving changes to class ${req.params.classId}`,
								500,
								null
							)
						);
				} else {
					res.json(
						new Payload(
							`Changes to class ${req.params.classId} saved successfully.`,
							200,
							editedClass
						)
					);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];
const delete_class: RequestHandler[] = [
	param('classId').trim().isLength({ min: 1 }).escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			const targetId = req.params.classId;
			try {
				const classExists: ClassInterface | null = await ClassModel.findById({
					_id: targetId,
				});

				if (classExists) {
					const deletedClass: Document | null =
						await ClassModel.findOneAndDelete({ _id: targetId }).exec();

					const editedStudents : UpdateWriteOpResult =  await studentModel
						.updateMany({ classes: targetId }, { $pull: { classes: targetId } }).exec()
					
					if (!deletedClass) {
						res.status(500).json(new Payload(`Error deleting class ${req.params.classId}`, 500, null))
					} else {
						res.json(new Payload(`Class ${req.params.id} deleted.`, 200, deletedClass))
					}

				} else {
					res.status(404).json({
						message: 'Class not found.',
						statusCode: 404,
						content: null,
					});
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];
export default {
	get_class_instance,
	get_org_classes,
	create_class,
	edit_class,
	add_teacher,
	remove_teacher,
	delete_class,
	search_class,
};
