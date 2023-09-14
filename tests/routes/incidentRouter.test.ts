import ClassModel, { ClassInterface } from '../../models/classModel.js';
import User, { UserInterface } from '../../models/userModel.js';
import Org, { OrgInterface } from '../../models/orgModel.js';
import Incident, { IncidentInterface } from '../../models/docTypes/incidentModel.js';

import app from '../setup/appSetup.js'

import request, { Response } from 'supertest';
import testJWT from '../setup/testJWT.js';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Document, ObjectId } from 'mongoose';
import initializeTestDB from '../setup/dbSetup.js';
import studentModel, { StudentInterface } from '../../models/studentModel.js';

let mongod: MongoMemoryServer

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

describe("Docs/Incident GET", (): void => {
	it("Gets incident (200)", async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetIncident: IncidentInterface | null = await Incident.findOne({}).exec();

		const getReq: Response = await request(app)
			.get(`/docs/incidents/${targetIncident?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ 'authorization': testToken })
			.expect(200);

		expect(getReq.body._id).toBe(targetIncident?._id.toString());
	});
	it("Gets all incidents by student (200)", async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetStudent = await studentModel.findOne({first_name: "Joe", last_name: "Jack"}).exec();

		const getReq: Response = await request(app)
			.get(`/docs/incidents/student/${targetStudent?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ 'authorization': testToken })
			.expect(200);

		expect(getReq.body.length).toBe(1);

	})
})
