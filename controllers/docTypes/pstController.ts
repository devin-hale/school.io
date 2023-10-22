import PST, {
	PSTInterface,
	PSTHeaderInterface,
	PSTWeekInterface,
	PSTTier1Interface,
} from './../../models/docTypes/pstModel.js';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';
import {
	body,
	param,
	validationResult,
	Result,
	ValidationError,
} from 'express-validator';
import { ObjectId } from 'mongoose';
import { Payload } from '../utils/payload.js';

const get_pst_instance: RequestHandler[] = [
	param('pstId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const pstInstance: PSTInterface | null = await PST.findOne({
					_id: req.params.pstId,
				})
					.populate('owner')
					.populate('class')
					.populate('access')
					.populate('header.student');

				if (!pstInstance) {
					res
						.status(404)
						.json(new Payload(`PST Documentation not found.`, 404, null));
				} else {
					res.json(
						new Payload(
							`Retrieved PST Documentation ${req.params.pstId}`,
							200,
							pstInstance
						)
					);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_user_pst: RequestHandler[] = [
	param('userId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const userPSTs: PSTInterface[] = await PST.find({
					owner: req.params.userId,
				})
					.populate('owner')
					.populate('class')
					.populate('access')
					.populate('header.student');
				res.json(
					new Payload(
						`Retrieved PST Documentations for user ${req.params.userId}`,
						200,
						userPSTs
					)
				);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_org_pst: RequestHandler[] = [
	param('orgId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const orgPSTs: PSTInterface[] = await PST.find({
					org: req.params.orgId,
				})
					.populate('owner')
					.populate('class')
					.populate('access')
					.populate('header.student');

				res.json(
					new Payload(
						`Retrieved PST Documentation for organization ${req.params.orgId}`,
						200,
						orgPSTs
					)
				);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_class_pst: RequestHandler[] = [
	param('classId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const classPSTs: PSTInterface[] = await PST.find({
					class: req.params.classId,
				})
					.populate('owner')
					.populate('class')
					.populate('access')
					.populate('header.student');

				res.json(
					new Payload(
						`Retrieved PST documentation for class ${req.params.classId}`,
						200,
						classPSTs
					)
				);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_student_pst: RequestHandler[] = [
	param('studentId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const studentPSTs: PSTInterface[] = await PST.find({
					'header.student': req.params.studentId,
				})
					.populate('owner')
					.populate('class')
					.populate('access')
					.populate('header.student');

				res.json(
					new Payload(
						`Retrieved PST documentation for user ${req.params.studentId}`,
						200,
						studentPSTs
					)
				);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const create_pst: RequestHandler[] = [
	body('classId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const newPST = {
					owner: req.body.token.userId,
					org: req.body.token.org,
					class: req.body.classId,
					weeks: [
						{
							weekNo: 1,
							dates: '',
							attendance: {
								monday: '',
								tuesday: '',
								wednesday: '',
								thursday: '',
								friday: '',
							},
							tier1: [],
							tier2: [],
							parentComm: [],
							progressMonitor: [],
						},
					],
				};

				const savedPST: PSTInterface | null = await PST.create(newPST);

				if (!savedPST) {
					res
						.status(500)
						.json(new Payload(`Error creating PST Documentation.`, 500, null));
				} else {
					res
						.status(201)
						.json(
							new Payload(
								`PST Documentation created successfully.`,
								201,
								savedPST
							)
						);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const add_student: RequestHandler[] = [
	param('pstId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const pstExists: PSTInterface | null = await PST.findOne({
					_id: req.params.pstId,
				});

				if (!pstExists) {
					res
						.status(404)
						.json(new Payload(`PST Documentation not found.`, 404, null));
				} else {
					const updatedPST: PSTInterface | null = await PST.findOneAndUpdate(
						{ _id: req.params.pstId },
						{ 'header.student': req.body.studentId },
						{ new: true }
					);

					if (!updatedPST) {
						res
							.status(500)
							.json(
								new Payload(
									`Error updating PST Documentation ${req.params.pstId}`,
									500,
									null
								)
							);
					} else {
						res
							.status(200)
							.json(
								new Payload(
									`PST Documentation ${req.params.pstId} updated successfully.`,
									200,
									updatedPST
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

const add_week: RequestHandler[] = [
	param('pstId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const pstExists: PSTInterface | null = await PST.findOne({
					_id: req.params.pstId,
				});

				if (!pstExists) {
					res
						.status(404)
						.json(new Payload(`PST Documentation not found.`, 404, null));
				} else {
					const weekData = {
						weekNo: pstExists.weeks[pstExists.weeks.length - 1].weekNo + 1 || 1,
						dates: '',
						attendance: {
							monday: '',
							tuesday: '',
							wednesday: '',
							thursday: '',
							friday: '',
						},
						tier1: [],
						tier2: [],
						parentComm: [],
						progressMonitor: [],
					};

					const updatedPST: PSTInterface | null = await PST.findOneAndUpdate(
						{ _id: req.params.pstId },
						{ $push: { weeks: weekData } },
						{ new: true }
					);

					if (!updatedPST) {
						res
							.status(500)
							.json(
								new Payload(
									`Error updating PST Documentation ${req.params.pstId}`,
									500,
									null
								)
							);
					} else {
						res
							.status(200)
							.json(
								new Payload(
									`PST Documentation ${req.params.pstId} updated successfully.`,
									200,
									updatedPST
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

const edit_header: RequestHandler[] = [
	param('pstId').trim().escape(),
	body('intervention_type').trim(),
	body('schoolYear').trim(),
	body('west_virginia_phonics').trim(),
	body('progress_monitoring_goal').trim(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const pstExists: PSTInterface | null = await PST.findOne({
					_id: req.params.pstId,
				});

				if (!pstExists) {
					res
						.status(404)
						.json(new Payload(`PST Documentation not found.`, 404, null));
				} else {
					const headerEdit = {
						student: pstExists.header.student,
						schoolYear: req.body.schoolYear || pstExists.header.schoolYear,
						intervention_type:
							req.body.intervention_type || pstExists.header.intervention_type,
						west_virginia_phonics:
							req.body.west_virginia_phonics ||
							pstExists.header.west_virginia_phonics,
						progress_monitoring_goal:
							req.body.progress_monitoring_goal ||
							pstExists.header.progress_monitoring_goal,
					};
					const updatedPST: PSTInterface | null = await PST.findOneAndUpdate(
						{ _id: req.params.pstId },
						{ header: headerEdit },
						{ new: true }
					);

					if (!updatedPST) {
						res
							.status(500)
							.json(
								new Payload(
									`Error updating PST Documentation ${req.params.pstId}`,
									500,
									null
								)
							);
					} else {
						res
							.status(200)
							.json(
								new Payload(
									`PST Documentation ${req.params.pstId} updated successfully.`,
									200,
									updatedPST
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

const edit_week: RequestHandler[] = [
	param('pstId').trim().escape(),
	param('weekNo').trim().escape(),
	body('dates').optional().trim(),
	body('attendance').optional().isObject(),
	body('tier1').optional().isObject(),
	body('tier2').optional().isArray(),
	body('parentComm').optional().trim(),
	body('progressMonitor').optional().trim(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const pstExists: PSTInterface | null = await PST.findOne({
					_id: req.params.pstId,
					'weeks.weekNo': req.params.weekNo,
				}).lean();

				if (!pstExists) {
					res
						.status(404)
						.json(new Payload(`PST Documentation not found.`, 404, null));
				} else {
					const targetWeek: PSTWeekInterface = pstExists.weeks.filter(
						(week) => week.weekNo == Number(req.params.weekNo)
					)[0];

					const updatedWeek: PSTWeekInterface = {
						weekNo: Number(req.params.weekNo),
						dates: req.body.dates || targetWeek.dates,
						attendance: req.body.attendance ?? targetWeek.attendance,
						tier1: req.body.tier1 ?? targetWeek.tier1,
						tier2: req.body.tier2 || targetWeek.tier2,
						parentComm: req.body.parentComm || targetWeek.parentComm,
						progressMonitor:
							req.body.progressMonitor || targetWeek.progressMonitor,
					};

					const prevWeeks: PSTWeekInterface[] = pstExists.weeks.filter(
						(week) => week.weekNo !== Number(req.params.weekNo)
					);

					const newWeeks: PSTWeekInterface[] = [...prevWeeks, updatedWeek];

					const DBWeekUpdate: PSTInterface | null = await PST.findOneAndUpdate(
						{
							_id: req.params.pstId,
							'weeks.weekNo': req.params.weekNo,
						},
						{
							weeks: newWeeks,
						},
						{ new: true }
					);
					if (!DBWeekUpdate) {
						res
							.status(500)
							.json(
								new Payload(
									`Error updating PST Documentation ${req.params.pstId}`,
									500,
									null
								)
							);
					} else {
						res
							.status(200)
							.json(
								new Payload(
									`PST Documentation ${req.params.pstId} updated successfully.`,
									200,
									DBWeekUpdate
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

const edit_access: RequestHandler[] = [
	param('pstId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const pstExists: PSTInterface | null = await PST.findOne({
					_id: req.params.pstId,
				});

				if (!pstExists) {
					res
						.status(404)
						.json(new Payload(`PST Documentation not found.`, 404, null));
				} else {
					const pstAccess: ObjectId[] = req.body.access;

					const updatedPST: PSTInterface | null = await PST.findOneAndUpdate(
						{ _id: req.params.pstId },
						{ access: pstAccess },
						{ new: true }
					);

					if (!updatedPST) {
						res
							.status(500)
							.json(
								new Payload(
									`Error updating PST Documentation ${req.params.pstId}`,
									500,
									null
								)
							);
					} else {
						res
							.status(200)
							.json(
								new Payload(
									`PST Documentation ${req.params.pstId} updated successfully.`,
									200,
									updatedPST
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

const delete_week: RequestHandler[] = [
	param('pstId').trim().escape(),
	param('weekNo').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const pstExists: PSTInterface | null = await PST.findOne({
					_id: req.params.pstId,
					'weeks.weekNo': Number(req.params.weekNo),
				});

				if (!pstExists) {
					res
						.status(404)
						.json(new Payload(`PST Documentation not found.`, 404, null));
				} else {
					const pstWeeks: PSTWeekInterface[] = pstExists.weeks.sort((a, b) =>
						a.weekNo < b.weekNo ? -1 : 1
					);

					if (
						pstWeeks[pstWeeks.length - 1].weekNo !== Number(req.params.weekNo)
					) {
						res
							.status(400)
							.json({ message: 'Error: Can only delete last week.' });
					} else {
						const updatedPST: PSTInterface | null = await PST.findOneAndUpdate(
							{ _id: req.params.pstId },
							{ $pull: { weeks: { weekNo: Number(req.params.weekNo) } } },
							{ new: true }
						);
						if (!updatedPST) {
							res
								.status(500)
								.json(
									new Payload(
										`Error updating PST Documentation ${req.params.pstId}`,
										500,
										null
									)
								);
						} else {
							res
								.status(200)
								.json(
									new Payload(
										`PST Documentation ${req.params.pstId} updated successfully.`,
										200,
										updatedPST
									)
								);
						}
					}
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const delete_pst: RequestHandler[] = [
	param('pstId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const pstExists: PSTInterface | null = await PST.findOne({
					_id: req.params.pstId,
				});

				if (!pstExists) {
					res
						.status(404)
						.json(new Payload(`PST Documentation not found.`, 404, null));
				} else {
					const deletedPST: PSTInterface | null = await PST.findOneAndDelete({
						_id: req.params.pstId,
					}).exec();

					if (!deletedPST) {
						res
							.status(500)
							.json(
								new Payload(
									`Error deleting PST Documentation ${req.params.pstId}`,
									500,
									null
								)
							);
					} else {
						res
							.status(200)
							.json(
								new Payload(
									`PST Documentation ${req.params.pstId} deleted successfully.`,
									200,
									deletedPST
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

export default {
	get_pst_instance,
	get_user_pst,
	get_org_pst,
	get_class_pst,
	get_student_pst,
	create_pst,
	add_student,
	add_week,
	edit_header,
	edit_week,
	edit_access,
	delete_week,
	delete_pst,
};
