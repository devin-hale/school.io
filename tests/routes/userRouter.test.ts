import ClassModel, { ClassInterface } from '../../models/classModel.js';
import User, { UserInterface } from '../../models/userModel.js';
import Org, { OrgInterface } from '../../models/orgModel.js';

import app from '../setup/appSetup.js'

import request, { Response } from 'supertest';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Document } from 'mongoose';
import initializeTestDB from '../setup/dbSetup.js';

let mongod: MongoMemoryServer

beforeAll(async (): Promise<void> => {
	mongod = await MongoMemoryServer.create();
	await mongoose.connect(mongod.getUri());
	await initializeTestDB();


})
afterAll(async (): Promise<void> => {
	await mongoose.connection.dropDatabase();
	await mongod.stop();
	await mongoose.disconnect();

})

describe("User GET", (): void => {
	it("Gets user info by ID.", async (): Promise<void> => {
		const targetUser: UserInterface | null = await User.findOne({}).exec();
		const getReq: Response = await request(app)
			.get(`/users/${targetUser?._id}`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.expect(200)

		expect(getReq.body._id.toString()).toBe(targetUser?._id.toString())
	})
	it("404 on user not found", async (): Promise<void> => {
		const getReq: Response = await request(app)
			.get(`/users/64ebe2c3ad586fd7e48f93b5`)
			.set(`Content-type`, `application/json; charset=utf-8`)
			.expect(404)

		expect(getReq.body.message).toBe("User could not be found.")
	})
})
