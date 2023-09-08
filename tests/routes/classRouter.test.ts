import ClassModel, { ClassInterface } from '../../models/classModel.js';
import User, { UserInterface } from '../../models/userModel.js';
import Org, { OrgInterface } from '../../models/orgModel.js';

import app from '../setup/appSetup.js'

import request, { Response } from 'supertest';
import testJWT from './../setup/testJWT.js';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Document, ObjectId } from 'mongoose';
import initializeTestDB from '../setup/dbSetup.js';
import studentModel, { StudentInterface } from '../../models/studentModel.js';

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

describe("Class GET ", (): void => {
	it("Queries all classes (200)", async (): Promise<void> => {
		const testToken : string = await testJWT(app);
		const searchName: string = "Test+Class";
		const searchTeacher: string = 'Billy';
		const searchSubject: string = 'Test'

		const searchReq: Response = await request(app)
			.get(`/classes/search?name=${searchName}&subject=${searchSubject}&teacher=${searchTeacher}`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({'Authorization': testToken})
			.expect(200)

		expect(searchReq.body.searchResults.length).toBe(1)
	})
	it("Returns a specific Class", async (): Promise<void> => {
		const testToken : string = await testJWT(app);
		const classInstance: ClassInterface | null = await ClassModel.findOne({});

		const response: Response = await request(app)
			.get(`/classes/${classInstance?._id}`)
			.set({'Authorization': testToken})
			.expect("Content-Type", 'application/json; charset=utf-8')
			.expect(200)
		expect(response.body.classInstance._id).toBe(`${classInstance?._id}`)
	})

	it("404 when class not found", async (): Promise<void> => {
		const testToken : string = await testJWT(app);
		const getReq: Response = await request(app)
			.get(`/classes/64ebe2c3ad586fd7e48f93b5`)
			.set({'Authorization': testToken})
			.expect(404)

		expect(getReq.body.message).toBe("Class not found.")
	})

	it("Returns all Classes of a given Org", async (): Promise<void> => {
		const testToken : string = await testJWT(app);
		const org: OrgInterface | null = await Org.findOne({});

		const reqTest: Response = await request(app)
			.get(`/classes/org/${org?._id}`)
			.set({'Authorization': testToken})
			.expect("Content-Type", 'application/json; charset=utf-8')
			.expect(200)
		expect(reqTest.body.classes[0].org).toBe(`${org?._id}`);
	})




})

describe("Class POST", (): void => {
	it("Creates class", async (): Promise<void> => {
		const testToken : string = await testJWT(app);
		const org: OrgInterface | null = await Org.findOne({});
		const user: UserInterface | null = await User.findOne({});
		const newClass: Object =
		{
			name: "Test Class",
			grade_level: "4",
			subject: "Test Subject",
			teachers: [user?._id],
			org: org?._id

		}
		const testReq: Response = await request(app)
			.post(`/classes/create`)
			.set('Content-Type', 'application/json')
			.set({'Authorization': testToken})
			.send(newClass)
			.expect("Content-Type", 'application/json; charset=utf-8')
			.expect(201);
		expect(testReq.body.content.name).toEqual("Test Class")
	})


	it("Return 400 when creating class with invalid params", async (): Promise<void> => {
		const testToken : string = await testJWT(app);
		const newClass: Object = {};
		const testReq: Response = await request(app)
			.post(`/classes/create`)
			.set('Content-Type', 'application/json')
			.set({'Authorization': testToken})
			.send(newClass)
			.expect(400)
		expect(testReq.body.message).toBe("Invalid parameters.")

	})
})

describe("Class PUT", (): void => {
	it("Edit class name/grade_level/subject", async (): Promise<void> => {
		const testToken : string = await testJWT(app);
		const targetClass: ClassInterface | null = await ClassModel.findOne({}).exec();
		const editContent = {
			name: "Edited Name",
			grade_level: "5",
			subject: "Math"
		}

		const editReq: Response = await request(app)
			.put(`/classes/edit/${targetClass?._id}`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({'Authorization': testToken})
			.send(editContent)
			.expect(200)

		expect(editReq.body.message).toBe("Class information edited.");
		expect(editReq.body.content.name).toBe("Edited Name");
		expect(editReq.body.content.grade_level).toBe("5");
		expect(editReq.body.content.subject).toBe("Math");
	})

	it("Add teacher to class", async (): Promise<void> => {
		const testToken : string = await testJWT(app);
		const org: OrgInterface | null = await Org.findOne({});
		const newTeacher: Document = new User({
			first_name: "Carl",
			last_name: "Walker",
			email: "carlwalker@gmail.com",
			password: "1234",
			gender: "M",
			verifed: true,
			org: org?._id
		});
		const savedTeacher = await newTeacher.save();

		const targetClass: ClassInterface | null = await ClassModel.findOne({}).lean().populate("teachers").exec();

		const editReq: Response = await request(app)
			.put(`/classes/${targetClass?._id}/teachers/add`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({'Authorization': testToken})
			.send({ _id: savedTeacher?._id })
			.expect(200)
		expect(editReq.body.message).toBe("Teacher added to class.")

		const editedClass: ClassInterface | null = await ClassModel.findOne({}).lean().populate("teachers").exec();

		const newTeachArr: ObjectId[] | undefined = editedClass?.teachers
		expect(newTeachArr?.some(t => t.toString() === savedTeacher._id.toString())).toBeTruthy
	})
	it("Removes teacher from class", async (): Promise<void> => {

		const testToken : string = await testJWT(app);
		const targetClass: ClassInterface | null = await ClassModel.findOne({}).lean().exec();
		const teacherId = targetClass?.teachers?.[0];

		const editReq: Response = await request(app)
			.put(`/classes/${targetClass?._id}/teachers/remove`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({'Authorization': testToken})
			.send({ _id: teacherId })
			.expect(200);
		expect(editReq.body.message).toBe("Teacher removed from class.")


		const editedClass: ClassInterface | null = await ClassModel.findOne({}).lean().exec();

		const newTeachArr: ObjectId[] | undefined = editedClass?.teachers
		expect(newTeachArr?.some(t => t.toString() === teacherId?.toString())).toBeFalsy

	})
})

describe("Class DELETE", (): void => {
	it("Deletes class.", async (): Promise<void> => {
		const testToken : string = await testJWT(app);
		const targetClass: ClassInterface | null = await ClassModel.findOne({}).lean().exec();
		const targetId = targetClass?._id;

		await request(app)
			.delete(`/classes/${targetClass?._id}/delete`)
			.set('Content-Type', 'application/json; charset=utf-8')
			.set({'Authorization': testToken})
			.expect(200);

		const deletedClass: ClassInterface | null = await ClassModel.findOne({ _id: targetId }).lean().exec();
		const searchStudents : StudentInterface[] | null = await studentModel.find({classes: targetId}).lean().exec();

		expect(deletedClass).toBeNull
		expect(searchStudents).toBeNull
	})
})
