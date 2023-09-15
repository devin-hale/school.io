import Incident, {
	IncidentInterface,
} from './../../models/docTypes/incidentModel.js';
import User from './../../models/userModel.js';
import Student from './../../models/studentModel.js';
import { body, param, validationResult, Result } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';
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

//PUT :: Update incident.

const update_incident_record = [
	body('_id').trim().escape(),
	body('owner').trim().escape(),
	body('access').trim().escape(),
	body('date_of_occurence').trim().escape(),
	body('staff_involved').trim().escape(),
	body('parents_involved').trim().escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			//TODO: Replace with relevant URL.
			res.render('./../views/inded.ejs', {
				message: 'Error creating incident record.',
			});
		} else {
			const recordExists = Incident.findById(req.body._id).exec();

			if (!recordExists) {
				res.render('./../views/inded.ejs', {
					message: 'Error creating incident record.',
				});
			} else {
				const editRecord = {
					owner: req.body.owner,
					access: req.body.access,
					date_of_occurence: req.body.date_of_occurence,
					staff_involved: req.body.staff_involved,
					parents_involved: req.body.parents_involved,
					others_involved: req.body.others_involved,
					subject: req.body.subject,
					description: req.body.description,
					action_taken: req.body.action_taken,
				};

				await Incident.findByIdAndUpdate(req.body._id, editRecord);

				//TODO: Replace with relevant URL/file.
				res.render('./../views/docTypes/incident/createIncident.ejs');
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
	update_incident_record,
};
