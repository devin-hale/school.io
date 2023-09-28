import User, { UserInterface } from '../../models/userModel.js';
import Org, { OrgInterface } from '../../models/orgModel.js';

import app from '../setup/appSetup.js';

import request, { Response } from 'supertest';
import testJWT from '../setup/testJWT.js';

import bcrypt from 'bcryptjs';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import initializeTestDB from '../setup/dbSetup.js';
import classModel, { ClassInterface } from '../../models/classModel.js';

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

describe('User GET', (): void => {
	it('Queries all users (200)', async (): Promise<void> => {
		const testToken: string = await testJWT(app);
		const searchTerm: string = 'Billy';

		const searchReq: Response = await request(app)
			.get(`/users/search?search=${searchTerm}`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({ Authorization: testToken })
			.expect(200);

		expect(searchReq.body.content.length).toBe(1);
	});
	it('Gets user info by ID (200)', async (): Promise<void> => {
		const testToken: string = await testJWT(app);
		const targetUser: UserInterface | null = await User.findOne({}).exec();
		const getReq: Response = await request(app)
			.get(`/users/${targetUser?._id}`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({ Authorization: testToken })
			.expect(200);

		expect(getReq.body.content._id.toString()).toBe(targetUser?._id.toString());
	});
	it('User not found (404)', async (): Promise<void> => {
		const testToken: string = await testJWT(app);
		const getReq: Response = await request(app)
			.get(`/users/64ebe2c3ad586fd7e48f93b5`)
			.set(`Content-type`, `application/json; charset=utf-8`)
			.set({ Authorization: testToken })
			.expect(404);

		expect(getReq.body.statusCode).toBe(404);
	});
	it('Returns all Classes of a given User', async (): Promise<void> => {
		const testToken: string = await testJWT(app);
		const user: UserInterface | null = await User.findOne({});

		const reqTest: Response = await request(app)
			.get(`/users/${user?._id}/classes`)
			.expect('Content-Type', 'application/json; charset=utf-8')
			.set({ Authorization: testToken })
			.expect(200);
		expect(reqTest.body.content[0].teachers[0]._id).toEqual(`${user?._id}`);
	});
});
describe('User POST', (): void => {
	it('Creates account (201)', async (): Promise<void> => {
		const targetOrg: OrgInterface | null = await Org.findOne({}).exec();
		const orgCode: string | undefined = targetOrg?.orgCode?.toString();

		const newUser: Object = {
			first_name: 'Test',
			last_name: 'Joe',
			email: 'testjoe@cilly.com',
			password: '123456',
			gender: 'M',
			orgCode: orgCode,
		};

		const postReq: Response = await request(app)
			.post(`/users/create`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.send(newUser)
			.expect(201);

		const findNewUser = await User.findOne({ _id: postReq.body._id })
			.lean()
			.exec();

		expect(findNewUser).toBeTruthy;
	});
	it('Create account fails (400)', async (): Promise<void> => {
		const targetOrg: OrgInterface | null = await Org.findOne({}).exec();
		const orgCode: string | undefined = targetOrg?.orgCode?.toString();

		const newUser: Object = {
			first_name: '',
			last_name: '',
			email: 'testjoe',
			password: '126',
			gender: 'M',
			orgCode: orgCode,
		};

		const postReq: Response = await request(app)
			.post(`/users/create`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.send(newUser)
			.expect(400);

		expect(postReq.body.statusCode).toBe(400);
	});
});

describe('User PUT', (): void => {
	it('Edits basic user info (200)', async (): Promise<void> => {
		const testToken: string = await testJWT(app);
		const targetUser: UserInterface | null = await User.findOne({}).exec();

		const editedUser: Object = {
			first_name: 'Bill',
			last_name: 'Nye',
			gender: 'F',
		};

		const postReq: Response = await request(app)
			.put(`/users/edit/${targetUser?._id}`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({ Authorization: testToken })
			.send(editedUser)
			.expect(200);

		const findEditedUser = await User.findOne({ _id: postReq.body.content._id })
			.lean()
			.exec();

		expect(findEditedUser?.first_name).toBe('Bill');
		expect(findEditedUser?.last_name).toBe('Nye');
		expect(findEditedUser?.gender).toBe('F');
	});

	it('User info edit fails (400)', async (): Promise<void> => {
		const testToken: string = await testJWT(app);
		const targetUser: UserInterface | null = await User.findOne({}).exec();

		const editedUser: Object = {
			first_name: '',
			last_name: '',
			gender: 'F',
		};

		request(app)
			.put(`/users/edit/${targetUser?._id}`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({ Authorization: testToken })
			.send(editedUser)
			.expect(400);
	});

	it('Edits user email (200)', async (): Promise<void> => {
		const testToken: string = await testJWT(app);
		const targetUser: UserInterface | null = await User.findOne({}).exec();

		const newEmail: string = 'charlieboy@joe.net';

		await request(app)
			.put(`/users/${targetUser?._id}/email/edit`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({ Authorization: testToken })
			.send({ email: newEmail })
			.expect(200);

		const editedUser = await User.findOne({ _id: targetUser?._id }).exec();

		expect(editedUser?.email).toBe(newEmail);
	});

	it('Email edit fails (400)', async (): Promise<void> => {
		const testToken: string = await testJWT(app);
		const targetUser: UserInterface | null = await User.findOne({}).exec();

		const newEmail: string = 'charlie';

		const putReq: Response = await request(app)
			.put(`/users/${targetUser?._id}/email/edit`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({ Authorization: testToken })
			.send({ email: newEmail })
			.expect(400);

		expect(putReq.body.statusCode).toBe(400);
	});
	it('Edits user password (200)', async (): Promise<void> => {
		const testToken: string = await testJWT(app);
		const targetUser: UserInterface | null = await User.findOne({
			first_name: 'Bill',
			last_name: 'Nye',
		}).exec();

		const currentPass: string = '123456';
		const newPassword: string = '965432';

		const putReq: Response = await request(app)
			.put(`/users/${targetUser?._id}/password/edit`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({ Authorization: testToken })
			.send({ currentPass: currentPass, newPass: newPassword })
			.expect(200);

		const editedUser: UserInterface | null = await User.findOne({
			first_name: 'Zane',
			last_name: 'Zaneson',
		})
			.lean()
			.exec();

		const match = await bcrypt.compare(newPassword, editedUser!.password);

		expect(match).toBeTruthy;
	});
	it('Password edit fails (400)', async (): Promise<void> => {
		const testToken: string = await testJWT(app);
		const targetUser: UserInterface | null = await User.findOne({
			first_name: 'Zane',
			last_name: 'Zaneson',
		}).exec();

		const currentPass: string = '777777';
		const newPassword: string = '999999';

		await request(app)
			.put(`/users/${targetUser?._id}/password/edit`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({ Authorization: testToken })
			.send({ currentPass: currentPass, newPass: newPassword })
			.expect(400);

		const editedUser: UserInterface | null = await User.findOne({
			first_name: 'Zane',
			last_name: 'Zaneson',
		})
			.lean()
			.exec();

		const match = await bcrypt.compare(newPassword, editedUser!.password);

		expect(match).toBeFalsy;
	});
	it('User verified (200)', async (): Promise<void> => {
		const targetUser: UserInterface | null = await User.findOne({
			first_name: 'Zane',
			last_name: 'Zaneson',
		}).exec();

		await request(app)
			.put(`/users/${targetUser?._id}/verify`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.send()
			.expect(200);

		const verifiedUser: UserInterface | null = await User.findOne({
			first_name: 'Zane',
			last_name: 'Zaneson',
		}).exec();

		expect(verifiedUser?.verified).toBeTruthy;
	});
});

describe('User DELETE', (): void => {
	it('Deletes user (200)', async (): Promise<void> => {
		const targetUser: UserInterface | null = await User.findOne({}).exec();

		const testToken: string = await testJWT(app);

		await request(app)
			.delete(`/users/${targetUser?._id}/delete`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({ Authorization: testToken })
			.send({ password: '965432' })
			.expect(200);

		const targetExists: UserInterface | null = await User.findOne({
			_id: targetUser?._id,
		})
			.lean()
			.exec();
		const targetExistsInClasses: ClassInterface[] | null = await classModel
			.find({ teachers: targetUser?._id })
			.lean()
			.exec();

		expect(targetExists).toBeNull;
		expect(targetExistsInClasses).toBeNull;
	});
});
