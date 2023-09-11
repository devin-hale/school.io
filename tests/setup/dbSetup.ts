import ClassModel from '../../models/classModel';
import UserModel from '../../models/userModel';
import StudentModel from '../../models/studentModel';
import OrgModel from '../../models/orgModel';

import util from 'util';
import bcrypt from 'bcryptjs';
import studentModel from '../../models/studentModel';

const asyncHash: (arg1: string, arg2: string | number) => Promise<string> = util.promisify(bcrypt.hash);

async function initializeTestDB(): Promise<void> {
	const testOrg = new OrgModel({
		name: "Test Org"
	});
	const saveTestOrg = await testOrg.save();

	const testUser = new UserModel({
		first_name: "Billy",
		last_name: "Johnson",
		email: "bjohnson@mail.com",
		password: await asyncHash("123456", 10),
		gender: "M",
		verifed: true,
		org: saveTestOrg._id
	});

	await testUser.save();

	const testUser2 = new UserModel({
		first_name: "Zane",
		last_name: "Zaneson",
		email: "zaneson@mail.com",
		password: await asyncHash("123456", 10),
		gender: "M",
		verifed: true,
		org: saveTestOrg._id
	});

	await testUser2.save();

	const testClass = new ClassModel({
		name: "Test Class",
		grade_level: "1",
		subject: "Test",
		teachers: [testUser._id],
		org: saveTestOrg._id
	})
	await testClass.save();

	const testStudent = new StudentModel({
		first_name: "Joe",
		last_name: "Jack",
		grade_level: 4,
		gifted: false,
		retained: false,
		sped: false,
		english_language_learner: false,
		org: saveTestOrg._id
	})

	await testStudent.save();
};


export default initializeTestDB;
