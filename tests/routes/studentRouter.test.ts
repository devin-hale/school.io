import Student, {StudentInterface} from './../../models/studentModel.js';
import ClassModel, { ClassInterface } from '../../models/classModel.js';
import User, { UserInterface } from '../../models/userModel.js';
import Org, { OrgInterface } from '../../models/orgModel.js';

import app from '../setup/appSetup.js'

import request, { Response } from 'supertest';
import testJWT from './../setup/testJWT.js';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Document, ObjectId } from 'mongoose';
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

describe("Student GET", (): void => {
	it("Searches for student by name (200)", async(): Promise<void> => {
		const testToken = await testJWT(app);
		const searchTerm = "Sally+Joe"

		const getReq : Response = await request(app)
			.get(`/students/search?name=${searchTerm}`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({'authorization': testToken})
			.expect(200)

		expect(getReq.body.length).toBe(1);
		
	})
	it("Gets unique student info (200)", async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetStudent : StudentInterface | null = await Student.findOne({}).populate("classes").lean().exec();

		const getReq : Response = await request(app)
			.get(`/students/${targetStudent?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({'authorization': testToken})
			.expect(200);


		expect(getReq.body.student._id).toBe(targetStudent?._id.toString());
	});
	it("Gets all students by org (200)", async(): Promise<void> => {
        const testToken = await testJWT(app);
        const targetOrg : OrgInterface | null = await Org.findOne({}).exec();

        const getReq : Response = await request(app)
            .get(`/students/org/${targetOrg?._id}`)
            .set('Content-Type','application/json;charset=utf-8')
            .set({'authorization': testToken})
            .expect(200)

        expect(getReq.body.length).toBe(3)
    })

	//it("Gets all students by class (200)")
});
