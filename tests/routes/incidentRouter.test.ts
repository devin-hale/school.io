import ClassModel, { ClassInterface } from '../../models/classModel.js';
import Student from '../../models/studentModel.js';
import User, { UserInterface } from '../../models/userModel.js';
import Org, { OrgInterface } from '../../models/orgModel.js';
import Incident, {
	IncidentInterface,
} from '../../models/docTypes/incidentModel.js';

import app from '../setup/appSetup.js';

import request, { Response } from 'supertest';
import testJWT from '../setup/testJWT.js';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Document, ObjectId } from 'mongoose';
import initializeTestDB from '../setup/dbSetup.js';
import studentModel, { StudentInterface } from '../../models/studentModel.js';

let mongod: MongoMemoryServer;

beforeAll(async (): Promise<void> => {
	mongod = await MongoMemoryServer.create();
	await mongoose.connect(mongod.getUri());
	await initializeTestDB();
});

afterAll(async (): Promise<void> => {
	await mongoose.connection.dropDatabase();
	await mongod.stop();
	await mongoose.disconnect();
});

describe('Docs/Incident GET', (): void => {
	it('Gets incident (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetIncident: IncidentInterface | null = await Incident.findOne(
			{}
		).exec();

		const getReq: Response = await request(app)
			.get(`/docs/incidents/instance/${targetIncident?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		expect(getReq.body._id).toBe(targetIncident?._id.toString());
	});
	it('Gets all incidents by Student (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetStudent = await studentModel
			.findOne({ first_name: 'Joe', last_name: 'Jack' })
			.exec();

		const getReq: Response = await request(app)
			.get(`/docs/incidents/student/${targetStudent?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		expect(getReq.body.length).toBe(1);
	});
	it('Gets all incidents by Org (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetOrg: OrgInterface | null = await Org.findOne({
			name: 'Test Org',
		}).exec();

		const getReq: Response = await request(app)
			.get(`/docs/incidents/organization/${targetOrg?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		expect(getReq.body.length).toBe(1);
	});
	it('Gets all incidents by User (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);

		const getReq: Response = await request(app)
			.get(`/docs/incidents/user`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		expect(getReq.body.length).toBe(1);
	});
	it('Gets all incidents by Class (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetClass: ClassInterface | null = await ClassModel.findOne(
			{}
		).exec();

		const getReq: Response = await request(app)
			.get(`/docs/incidents/class/${targetClass?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		expect(getReq.body.length).toBe(1);
	});
});
describe('Incident POST', (): void => {
	it('Creates incident', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const testStudent: StudentInterface | null = await studentModel
			.findOne({})
			.exec();
		const testClass: ClassInterface | null = await ClassModel.findOne(
			{}
		).exec();

		const newIncident = {
			access: [],
			date_of_occurence: '2023-09-14',
			class: testClass?._id,
			staff_involved: [],
			students_involved: [testStudent?._id],
			parents_involved: [],
			others_involved: [],
			subject: 'Kyle Accident',
			description: 'Kyle did a bad thing.',
			action_taken: "I sent him to the principal's office.",
			parentOrGuardian_notified: true,
			notification_type: 'Text',
			escalated: true,
		};

		const postReq: Response = await request(app)
			.post(`/docs/incidents/create`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.send(newIncident)
			.expect(201);

		const savedIncident: IncidentInterface | null = await Incident.findOne({
			subject: 'Kyle Accident',
		}).exec();

		expect(savedIncident).toBeTruthy;
	});
});
describe('Incident PUT', (): void => {
	it('Edits basic incident info', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetIncident: IncidentInterface | null = await Incident.findOne({
			subject: 'Kyle Accident',
		});

		const editIncident = {
			date_of_occurence: '2021-09-14',
			subject: 'Kyle2 Accident',
			description: 'Kyle actually did a good thing.',
			action_taken: 'I gave him a hug.',
			parentOrGuardian_notified: false,
			notification_type: 'Phone',
			escalated: false,
		};

		const putReq: Response = await request(app)
			.put(`/docs/incidents/${targetIncident?._id}/info`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.send(editIncident)
			.expect(200);

		const savedIncident: IncidentInterface | null = await Incident.findOne({
			subject: 'Kyle2 Accident',
		}).exec();

		expect(savedIncident).toBeTruthy;
	});
	it('Edits incident involvement', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetIncident: IncidentInterface | null = await Incident.findOne({
			subject: 'Kyle2 Accident',
		});

		const targetUser = await User.findOne({ first_name: 'Billy' });
		const targetStudent = await Student.findOne({ first_name: 'Joe' });
		const parents = ['Daddy Jack', 'Momma Jack'];
		const others = ['Some Guy', 'Janitor'];

		const editedInvolvement = {
			staff_involved: [targetUser?._id],
			students_involved: [targetStudent?._id],
			parents_involved: parents,
			others_involved: others,
		};

		const putReq: Response = await request(app)
			.put(`/docs/incidents/${targetIncident?._id}/involvement`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.send(editedInvolvement)
			.expect(200);

		const savedIncident: IncidentInterface | null = await Incident.findOne({
			parents: "Daddy Jack"
		}).exec();

		expect(savedIncident).toBeTruthy;
	});

	it('Edits incident involvement with partial info', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetIncident: IncidentInterface | null = await Incident.findOne({
			subject: 'Kyle2 Accident',
		});

		const parents = ["Kyle2 Second Dad", 'Daddy Jack', 'Momma Jack'];

		const editedInvolvement = {
			parents_involved: parents,
		};

		const putReq: Response = await request(app)
			.put(`/docs/incidents/${targetIncident?._id}/involvement`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.send(editedInvolvement)
			.expect(200);

		const savedIncident: IncidentInterface | null = await Incident.findOne({
			parents_involved: "Daddy Jack"
		}).exec();

		expect(savedIncident).toBeTruthy;
		expect(savedIncident?.parents_involved!.length).toBe(3)
	});
});
