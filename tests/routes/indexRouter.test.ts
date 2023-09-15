import ClassModel, { ClassInterface } from '../../models/classModel.js';
import User, { UserInterface } from '../../models/userModel.js';
import Org, { OrgInterface } from '../../models/orgModel.js';

import app from '../setup/appSetup.js';

import request, { Response } from 'supertest';

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

describe('Index POST', (): void => {
	it('Logs in user (200)', async (): Promise<void> => {
		const email: string = 'bjohnson@mail.com';
		const password: string = '123456';

		const postReq: any = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json; charset=utf-8')
			.send({ email: email, password: password })
			.expect(200);

		expect(postReq.body.token).toBeTruthy;
	});
	it('Stay logged in Option (200)', async (): Promise<void> => {
		const email: string = 'bjohnson@mail.com';
		const password: string = '123456';

		const postReq: any = await request(app)
			.post('/login?stayLogged=true')
			.set('Content-Type', 'application/json; charset=utf-8')
			.send({ email: email, password: password })
			.expect(200);

		expect(postReq.body.token).toBeTruthy;
	});
	it('Fails to log in user (400)', async (): Promise<void> => {
		const email: string = 'wrong';
		const password: string = 'alsowrong';

		const postReq: any = await request(app)
			.post('/login')
			.set('Content-Type', 'application/json; charset=utf-8')
			.send({ email: email, password: password })
			.expect(400);
	});
});
