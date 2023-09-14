import ClassModel from '../../models/classModel';
import UserModel from '../../models/userModel';
import StudentModel from '../../models/studentModel';
import OrgModel from '../../models/orgModel';

import util from 'util';
import bcrypt from 'bcryptjs';
import studentModel from '../../models/studentModel';
import incidentModel from '../../models/docTypes/incidentModel';

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

	const savedUser = await testUser.save();

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
	const saveTestClass = await testClass.save();

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

	const student2 = new StudentModel({
		first_name: "Sally",
		last_name: "Joe",
		grade_level: 2,
		gifted: false,
		retained: true,
		sped: false,
		english_language_learner: false,
		org: saveTestOrg._id
	})
	const student3 = new StudentModel({
		first_name: "Kyle",
		last_name: "Wilson",
		grade_level: 1,
		gifted: true,
		retained: false,
		sped: false,
		english_language_learner: false,
		classes: [saveTestClass._id],
		org: saveTestOrg._id
	})

	const savedStudent = await testStudent.save();
	await student2.save();
	await student3.save();

	const incident = new incidentModel({
		owner: savedUser._id,
		access: [],
		date_of_occurence: '2023-09-14',
		staff_involved: [],
		students_involved: [savedStudent._id],
		parents_involved: [],
		others_involved: [],
		subject: "Joe Accident",
		description: "Joe did a bad thing.",
		action_taken: "I sent him to the principal's office.",
		parentOrGuardian_notified: true,
		notification_type: "Text",
		escalated: true,
		org: saveTestOrg._id
	})
	await incident.save();
};


export default initializeTestDB;
