import ClassModel, { ClassInterface } from '../../models/classModel.js';
import User, { UserInterface } from '../../models/userModel.js';
import Org, { OrgInterface } from '../../models/orgModel.js';
import studentModel, { StudentInterface } from '../../models/studentModel.js';
import Comm, { CommInterface } from '../../models/docTypes/comModel.js';

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

describe('Comm GET', (): void => {
	it('Gets comm instance (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetComm: CommInterface | null = await Comm.findOne({});

		const getReq: Response = await request(app)
			.get(`/docs/communications/${targetComm?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ Authorization: testToken })
			.expect(200);

		expect(getReq.body._id).toBe(targetComm?._id.toString());
	});
	it('Gets all user comms (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetUser = await User.findOne({ first_name: 'Zane' });

		const getReq: Response = await request(app)
			.get(`/docs/communications/user/${targetUser?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ Authorization: testToken })
			.expect(200);

		expect(getReq.body.length).toBe(2);
	});
});
describe('Comm POST', (): void => {
	it('Creates comm (201)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetUser: UserInterface | null = await User.findOne({
			first_name: 'Zane',
		});

		const comm2: object = {
			communication_type: 'Staff to Staff',
			date_of_occurence: '2022-09-20',
			staff_involved: [targetUser?._id],
			subject: 'Talked to myself again',
			description: 'Had a nice conversation, again',
			followUp: false,
		};

		const postReq: Response = await request(app)
			.post(`/docs/communications/create`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ Authorization: testToken })
			.send(comm2)
			.expect(201);

		expect(postReq.body.communication_type).toBe('Staff to Staff');
	});
});
describe('Comm PUT', (): void => {
	it('Edits comm info', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetComm: CommInterface | null = await Comm.findOne({});

		const editInfo: object = {
			communication_type: 'Staff to Student',
			date_of_occurence: '2022-09-30',
			subject: 'Talked to myself, student saw.',
			description: 'Convinced Billy that I was not hallucinating.',
		};

		const putReq: Response = await request(app)
			.put(`/docs/communications/${targetComm?._id}/editInf`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ Authorization: testToken })
			.send(editInfo)
			.expect(200);

		expect(putReq.body.communication_type).toBe('Staff to Student');
	});
	it('Edits comm involvement', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetComm: CommInterface | null = await Comm.findOne({});
		const targetUser: UserInterface | null = await User.findOne({});
		const targetStudent: StudentInterface | null = await studentModel.findOne(
			{}
		);

		const editInfo: object = {
			staff_involved: [targetUser?._id],
			student_involved: [targetStudent?._id],
			others_involved: ['Some Guy'],
		};

		const putReq: Response = await request(app)
			.put(`/docs/communications/${targetComm?._id}/editInv`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ Authorization: testToken })
			.send(editInfo)
			.expect(200);

		expect(putReq.body.staff_involved.length).toBe(1);
		expect(putReq.body.parents_involved.length).toBe(0);
		expect(putReq.body.others_involved[0]).toBe('Some Guy');
	});
	it('Edits comm involvement', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetComm: CommInterface | null = await Comm.findOne({});
		const targetUser: UserInterface | null = await User.findOne({});

		const editInfo: object = {
			access: [targetUser?._id]
		};

		const putReq: Response = await request(app)
			.put(`/docs/communications/${targetComm?._id}/editAccess`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ Authorization: testToken })
			.send(editInfo)
			.expect(200);

		expect(putReq.body.access.length).toBe(1);
		expect(putReq.body.access[0]).toBe(targetUser?._id.toString())
	});
});
describe("Comm DELETE", (): void => {
	it("Deletes communication (200)", async(): Promise<void> => {
		const testToken = await testJWT(app);
		const targetComm: CommInterface | null = await Comm.findOne({});

		const delReq : Response = await request(app)
			.delete(`/docs/communications/${targetComm?._id}/delete`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({Authorization: testToken})
			.expect(200)


		const deletedComm : CommInterface | null = await Comm.findOne({_id: targetComm?._id});

		expect(deletedComm).toBeNull
	})
})
