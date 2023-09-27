import Student, { StudentInterface } from './../../models/studentModel.js';
import ClassModel, { ClassInterface } from '../../models/classModel.js';
import User, { UserInterface } from '../../models/userModel.js';
import Org, { OrgInterface } from '../../models/orgModel.js';

import app from '../setup/appSetup.js';

import request, { Response } from 'supertest';
import testJWT from './../setup/testJWT.js';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Document, ObjectId } from 'mongoose';
import initializeTestDB from '../setup/dbSetup.js';
import orgModel from '../../models/orgModel.js';

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

describe('Student GET', (): void => {
	it('Searches for student by name (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const searchTerm = 'Sally+Joe';

		const getReq: Response = await request(app)
			.get(`/students/search?name=${searchTerm}`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		expect(getReq.body.length).toBe(1);
	});
	it('Gets unique student info (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetStudent: StudentInterface | null = await Student.findOne({})
			.populate('classes')
			.lean()
			.exec();

		const getReq: Response = await request(app)
			.get(`/students/${targetStudent?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		expect(getReq.body.student._id).toBe(targetStudent?._id.toString());
	});
	it('Gets all students by org (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetOrg: OrgInterface | null = await Org.findOne({}).exec();

		const getReq: Response = await request(app)
			.get(`/students/org/${targetOrg?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		expect(getReq.body.length).toBe(3);
	});

	it('Gets all students by class (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetClass: ClassInterface | null = await ClassModel.findOne(
			{}
		).exec();

		const getReq: Response = await request(app)
			.get(`/students/class/${targetClass?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		expect(getReq.body.students.length).toBe(1);
	});
});

describe('Student POST', (): void => {
	it('Creates Student (201)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetOrg: OrgInterface | null = await orgModel.findOne({}).exec();
		const studentInfo: object = {
			first_name: 'Leeroy',
			last_name: 'Jenkins',
			grade_level: 5,
			gifted: false,
			retained: true,
			sped: true,
			english_language_learner: false,
			org: targetOrg?._id,
		};

		await request(app)
			.post(`/students/create`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.send(studentInfo)
			.expect(201);

		const addedStudent: StudentInterface | null = await Student.findOne({
			first_name: 'Leeroy',
			last_name: 'Jenkins',
		})
			.lean()
			.exec();

		expect(addedStudent).toBeTruthy;
	});
});

describe('Student PUT', (): void => {
	it('Edits student info (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetStudent: StudentInterface | null = await Student.findOne({
			first_name: 'Leeroy',
			last_name: 'Jenkins',
		}).exec();
		const studentInfo: object = {
			first_name: 'Weeroy',
			last_name: 'Wenkins',
			grade_level: 4,
			gifted: true,
			retained: false,
			sped: false,
			english_language_learner: true,
		};

		await request(app)
			.put(`/students/${targetStudent?._id}/edit`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.send(studentInfo)
			.expect(200);

		const editedStudent: StudentInterface | null = await Student.findOne({
			first_name: 'Weeroy',
			last_name: 'Wenkins',
		}).exec();

		expect(editedStudent).toBeTruthy;
	});
	it('Adds student to class (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetStudent: StudentInterface | null = await Student.findOne({
			first_name: 'Weeroy',
			last_name: 'Wenkins',
		}).exec();
		const targetClass: ClassInterface | null = await ClassModel.findOne({})
			.lean()
			.exec();

		await request(app)
			.put(`/students/${targetStudent?._id}/classAdd/${targetClass?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		const editedStudent = await Student.findOne({
			_id: targetStudent?._id,
			classes: targetClass?._id,
		})
			.lean()
			.exec();

		expect(editedStudent).toBeTruthy;
	});
	it('Removes student from class (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetStudent: StudentInterface | null = await Student.findOne({
			first_name: 'Weeroy',
			last_name: 'Wenkins',
		}).exec();
		const targetClass: ClassInterface | null = await ClassModel.findOne({})
			.lean()
			.exec();

		await request(app)
			.put(`/students/${targetStudent?._id}/classRemove/${targetClass?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		const editedStudent = await Student.findOne({
			_id: targetStudent?._id,
			classes: targetClass?._id,
		})
			.lean()
			.exec();

		expect(editedStudent).toBeFalsy;
	});
	it('Toggles student as active/inactive (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetStudent: StudentInterface | null = await Student.findOne({
			first_name: 'Weeroy',
			last_name: 'Wenkins',
		}).exec();

		await request(app)
			.put(`/students/${targetStudent?._id}/toggleActive`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		const editedStudent = await Student.findOne({ _id: targetStudent?._id })
			.lean()
			.exec();

		expect(editedStudent?.active).toBeFalsy;
	});
});

describe('Student DELETE', (): void => {
	it('Deletes student (200)', async (): Promise<void> => {
		const testToken = await testJWT(app);
		const targetStudent: StudentInterface | null = await Student.findOne({
			first_name: 'Weeroy',
			last_name: 'Wenkins',
		}).exec();

		await request(app)
			.delete(`/students/${targetStudent?._id}`)
			.set('Content-Type', 'application/json;charset=utf-8')
			.set({ authorization: testToken })
			.expect(200);

		const editedStudent: StudentInterface | null = await Student.findOne({
			_id: targetStudent?._id,
		})
			.lean()
			.exec();

		expect(editedStudent).toBeNull;
	});
});
