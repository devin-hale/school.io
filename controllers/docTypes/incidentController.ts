import Incident, {
	IncidentInterface,
} from './../../models/docTypes/incidentModel.js';
import User from './../../models/userModel.js';
import Student from './../../models/studentModel.js';
import { body, param, validationResult, Result } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { Request, RequestHandler } from 'express';
import classModel, { ClassInterface } from '../../models/classModel.js';
import { Payload } from '../utils/payload.js';

const get_incident: RequestHandler[] = [
	param('incidentId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const incidentExists: IncidentInterface | null = await Incident.findOne(
					{ _id: req.params.incidentId }
				)
					.populate('owner')
					.populate('class')
					.populate('students_involved')
					.populate('staff_involved')
					.populate('access')
					.lean()
					.exec();

				if (!incidentExists) {
					res.status(400).json(new Payload('Incident not found.', 400, null));
				} else {
					res.json(
						new Payload(
							`Retrieved incident ${incidentExists?._id}`,
							200,
							incidentExists
						)
					);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_student_incidents: RequestHandler[] = [
	param('studentId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const studentIncidents: IncidentInterface[] = await Incident.find({
					students_involved: req.params.studentId,
				})
					.populate('owner')
					.populate('class')
					.populate('students_involved')
					.populate('staff_involved')
					.populate('access')
					.lean()
					.exec();

				res.json(
					new Payload(
						`Retrieved incidents for student ${req.params.studentId}`,
						200,
						studentIncidents
					)
				);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_org_incidents: RequestHandler[] = [
	param('orgId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const orgIncidents: IncidentInterface[] = await Incident.find({
					org: req.params.orgId,
				})
					.lean()
					.exec();

				res.json(
					new Payload(
						`Retrieved incidents for organization ${req.params.orgId}`,
						200,
						orgIncidents
					)
				);
			} catch (error) {
				next(error);
			}
		}
	}),
];

const get_user_incidents: RequestHandler = asyncHandler(
	async (req, res, next): Promise<void> => {
		try {
			const userIncidents: IncidentInterface[] = await Incident.find({
				owner: req.body.token.userId,
			})
				.populate('owner')
				.populate('class')
				.populate('students_involved')
				.populate('staff_involved')
				.populate('access')
				.lean()
				.exec();

			res.json(
				new Payload(
					`Retrieved incidents for user ${req.body.token.userId}`,
					200,
					userIncidents
				)
			);
		} catch (error) {
			next(error);
		}
	}
);

const get_class_incidents: RequestHandler[] = [
	param('classId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const classExists: ClassInterface | null = await classModel
					.findOne({ _id: req.params.classId })
					.exec();

				if (!classExists) {
					res.status(404).json({ message: 'Class not found' });
				} else {
					const classIncidents: IncidentInterface[] = await Incident.find({
						class: req.params.classId,
					})
						.populate('owner')
						.populate('students_involved')
						.populate('staff_involved')
						.populate('access')
						.lean()
						.exec();

					res.json(
						new Payload(
							`Retrieved incidents for class ${req.params.classId}`,
							200,
							classIncidents
						)
					);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const create_incident: RequestHandler[] = [
	body('access').optional({ checkFalsy: true }),
	body('students_involved').optional({ checkFalsy: true }),
	body('date_of_occurence'),
	body('class').optional(),
	body('staff_involved').optional({ checkFalsy: true }),
	body('parents_involved').optional({ checkFalsy: true }),
	body('others_involved').optional({ checkFalsy: true }),
	body('subject').isString().trim(),
	body('description').isString().trim(),
	body('action_taken').trim(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			const newRecord = new Incident({
				owner: req.body.token.userId,
				access: req.body.access,
				date_of_occurence: req.body.date_of_occurence,
				class: req.body.class,
				students_involved: req.body.students_involved,
				staff_involved: req.body.staff_involved,
				parents_involved: req.body.parents_involved,
				others_involved: req.body.others_involved,
				subject: req.body.subject,
				description: req.body.description,
				action_taken: req.body.action_taken,
				parentOrGuardian_notified: req.body.parentOrGuardian_notified,
				escalated: req.body.escalated,
			});

			const savedRecord: IncidentInterface | null = await newRecord.save();
			if (!savedRecord) {
				res.status(500).json(new Payload('Error saving incident.', 500, null));
			} else {
				res
					.status(201)
					.json(
						new Payload(`Incident ${savedRecord._id} created`, 201, savedRecord)
					);
			}
		}
	}),
];

const edit_incident_info = [
	param('incidentId').trim().escape(),
	body('date_of_occurence').trim(),
	body('subject').trim(),
	body('description').trim(),
	body('action_taken').trim(),
	body('parentOrGuardian_notified').isBoolean(),
	body('notification_type').trim(),
	body('escalated').isBoolean(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			const recordExists: IncidentInterface | null = await Incident.findById(
				req.params.incidentId
			).exec();

			if (!recordExists) {
				res.status(404).json({ message: 'Incident record not found.' });
			} else {
				const editRecord = {
					date_of_occurence: req.body.date_of_occurence,
					subject: req.body.subject,
					description: req.body.description,
					action_taken: req.body.action_taken,
					parentOrGuardian_notified: req.body.parentOrGuardian_notified,
					notification_type: req.body.notification_type,
					escalated: req.body.escalated,
				};

				const savedRecord: IncidentInterface | null =
					await Incident.findOneAndUpdate(
						{ _id: req.params.incidentId },
						editRecord,
						{
							new: true,
						}
					).populate('owner');

				if (!savedRecord) {
					res
						.status(500)
						.json(new Payload('Error saving incident.', 500, null));
				} else {
					res.json(
						new Payload(
							`Incident ${req.params.incidentId} saved successfully.`,
							200,
							savedRecord
						)
					);
				}
			}
		}
	}),
];

const edit_incident_involvement: RequestHandler[] = [
	param('incidentId').trim().escape(),
	body('staff_involved').optional().isArray(),
	body('students_involved').optional().isArray(),
	body('parents_involved').optional().isArray(),
	body('others_involved').optional().isArray(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const recordExists: IncidentInterface | null = await Incident.findById(
					req.params.incidentId
				).exec();

				if (!recordExists) {
					res.status(404).json({ message: 'Incident record not found.' });
				} else {
					const editRecord = {
						staff_involved:
							req.body.staff_involved || recordExists.staff_involved,
						students_involved:
							req.body.students_involved || recordExists.students_involved,
						parents_involved:
							req.body.parents_involved || recordExists.parents_involved,
						others_involved:
							req.body.others_involved || recordExists.others_involved,
					};

					const savedIncident: IncidentInterface | null =
						await Incident.findOneAndUpdate(
							{ _id: req.params.incidentId },
							editRecord,
							{ new: true }
						);

					if (!savedIncident) {
						res
							.status(500)
							.json(new Payload('Error saving incident.', 500, null));
					} else {
						res.json(
							new Payload(
								`Incident ${req.params.incidentId} saved successfully.`,
								200,
								savedIncident
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

const edit_incident_access: RequestHandler[] = [
	param('incidentId').trim().escape(),
	body('access').isArray(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const recordExists: IncidentInterface | null = await Incident.findById(
					req.params.incidentId
				).exec();

				if (!recordExists) {
					res.status(404).json({ message: 'Incident record not found.' });
				} else {
					const accessEdit = {
						access: req.body.access,
					};

					const savedAccess: IncidentInterface | null =
						await Incident.findOneAndUpdate(
							{ _id: req.params.incidentId },
							accessEdit,
							{ new: true }
						);

					if (!savedAccess) {
						res
							.status(500)
							.json(new Payload('Error saving incident.', 500, null));
					} else {
						res.json(
							new Payload(
								`Incident ${req.params.incidentId} saved successfully.`,
								200,
								savedAccess
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

const delete_incident: RequestHandler[] = [
	param('incidentId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json(new Payload('Invalid request.', 400, null));
		} else {
			try {
				const incidentExists: IncidentInterface | null = await Incident.findOne(
					{ _id: req.params.incidentId }
				);

				if (!incidentExists) {
					res.status(404).json({ message: 'ERROR: Incident not found.' });
				} else {
					const deletedIncident: IncidentInterface | null =
						await Incident.findOneAndDelete({
							_id: req.params.incidentId,
						});

					if (!deletedIncident) {
						res
							.status(500)
							.json(new Payload('Error saving incident.', 500, null));
					} else {
						res.json(
							new Payload(
								`Incident ${req.params.incidentId} deleted.`,
								200,
								deletedIncident
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
	get_incident,
	get_student_incidents,
	get_org_incidents,
	get_user_incidents,
	get_class_incidents,
	create_incident,
	edit_incident_info,
	edit_incident_involvement,
	edit_incident_access,
	delete_incident,
};
