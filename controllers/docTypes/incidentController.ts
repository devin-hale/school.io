import Incident, {
	IncidentInterface,
} from './../../models/docTypes/incidentModel.js';
import User from './../../models/userModel.js';
import Student from './../../models/studentModel.js';
import { body, param, validationResult, Result } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { Request, RequestHandler } from 'express';
import classModel, { ClassInterface } from '../../models/classModel.js';

const get_incident: RequestHandler[] = [
	param('incidentId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid request.' });
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
					res.status(400).json({ message: 'Invalid request.' });
				} else {
					res.json(incidentExists);
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
			res.status(400).json({ message: 'Invalid request.' });
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

				res.json(studentIncidents);
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
			res.status(400).json({ message: 'Invalid request.' });
		} else {
			try {
				const orgIncidents: IncidentInterface[] = await Incident.find({
					org: req.params.orgId,
				})
					.lean()
					.exec();

				res.json(orgIncidents);
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

			res.json(userIncidents);
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
			res.status(400).json({ message: 'Invalid request.' });
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

					res.json(classIncidents);
				}
			} catch (error) {
				next(error);
			}
		}
	}),
];

const create_incident: RequestHandler[] = [
	body('access').trim().optional({ checkFalsy: true }).escape(),
	body('students_involved').trim().optional({ checkFalsy: true }).escape(),
	body('date_of_occurence').trim().escape(),
	body('class').optional().trim().escape(),
	body('staff_involved').trim().optional({ checkFalsy: true }).escape(),
	body('parents_involved').trim().optional({ checkFalsy: true }).escape(),
	body('others_involved').trim().optional({ checkFalsy: true }).escape(),
	body('subject').trim().escape(),
	body('description').trim().escape(),
	body('action_taken').trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid request.' });
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

			const savedRecord: IncidentInterface = await newRecord.save();

			res.status(201).json(savedRecord);
		}
	}),
];

const edit_incident_info = [
	param('incidentId').trim().escape(),
	body('date_of_occurence').trim().escape(),
	body('subject').trim().escape(),
	body('description').trim().escape(),
	body('action_taken').trim().escape(),
	body('parentOrGuardian_notified').isBoolean().escape(),
	body('notification_type').trim().escape(),
	body('escalated').isBoolean().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid request.' });
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

				res.json(savedRecord);
			}
		}
	}),
];

const edit_incident_involvement: RequestHandler[] = [
	param('incidentId').trim().escape(),
	body('staff_involved').optional().isArray().escape(),
	body('students_involved').optional().isArray().escape(),
	body('parents_involved').optional().isArray().escape(),
	body('others_involved').optional().isArray().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid request.' });
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
						res.status(500).json({ message: 'Error saving changes.' });
					} else {
						res.json(savedIncident);
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
	body('access').isArray().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ message: 'Invalid request.' });
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
						res.status(500).json({ message: 'Error saving changes.' });
					} else {
						res.json(savedAccess);
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
			res.status(400).json({ message: 'Invalid request.' });
		} else {
			try {
				const incidentExists: IncidentInterface | null = await Incident.findOne(
					{ _id: req.params.incidentId }
				);

				if (!incidentExists) {
					res.status(404).json({ message: 'ERROR: Incident not found.' });
				} else {
					await Incident.findOneAndDelete({_id: req.params.incidentId});
					
					res.json({message: "Sucess"});
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
	delete_incident
};
