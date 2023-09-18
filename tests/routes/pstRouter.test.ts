import ClassModel, { ClassInterface } from '../../models/classModel.js';
import User, { UserInterface } from '../../models/userModel.js';
import Org, { OrgInterface } from '../../models/orgModel.js';
import studentModel, { StudentInterface } from '../../models/studentModel.js';
import Comm, { CommInterface } from '../../models/docTypes/comModel.js';
import PST, { PSTInterface } from '../../models/docTypes/pstModel.js';

import app from '../setup/appSetup.js';

import request, { Response } from 'supertest';
import testJWT from './../setup/testJWT.js';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Document, ObjectId } from 'mongoose';
import initializeTestDB from '../setup/dbSetup.js';

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

describe('PST GET', (): void => {
	it('Get PST Instance (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetPST: PSTInterface | null = await PST.findOne({});

		const getReq: Response = await request(app)
			.get(`/docs/pst/${targetPST?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ Authorization: testToken })
			.expect(200);

		expect(getReq.body.header).toBeTruthy;
	});
	it('Get user PST (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetUser: UserInterface | null = await User.findOne({first_name: 'Zane'});

		const getReq: Response = await request(app)
			.get(`/docs/pst/user/${targetUser?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ Authorization: testToken })
			.expect(200);

		expect(getReq.body.header).toBeTruthy;
	});
});
