import classRouter from '../../routes/classRouter.js'
import ClassModel from '../../models/classModel.js';
import User from '../../models/userModel.js';
import Org from '../../models/orgModel.js';

import request from 'supertest';
import express, { Express, response } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { FlattenMaps, ObjectId }  from 'mongoose';
import initializeTestDB from '../DB/testingSetup.js';

import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



let mongod: MongoMemoryServer

const app : Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/classes", classRouter);

app.use((req:any, res: any, next:any, err: any) : void => {
    console.log(err)
	res.status(500).send({ error: err });
});

beforeAll(async()=> {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    await initializeTestDB();

app.use(express.json());

})
afterAll(async()=> {
    await mongoose.connection.dropDatabase();
    await mongod.stop();
    await mongoose.disconnect();

})

describe("Class GET ", () => {

    it("Returns a specific Class", async () : Promise<void> => {
        const classInstance = await ClassModel.findOne({});
        const response = await request(app)
            .get(`/classes/${classInstance?._id}`)
            .expect("Content-Type", 'application/json; charset=utf-8')
            .expect(200)
        expect(response.body.classInstance._id).toBe(`${classInstance?._id}`)
    })

    it("404 when class not found", async () : Promise<void> => {
         await request(app)
            .get(`/classes/64ebe2c3ad586fd7e48f93b5`)
            .expect(404)
    })

    it("Returns all Classes of a given Org", async() : Promise<void> => {
        const org = await Org.findOne({});
        const reqTest = await request(app)
            .get(`/classes/org/${org?._id}`)
            .expect("Content-Type", 'application/json; charset=utf-8')
            .expect(200)
        expect(reqTest.body.classes[0].org).toBe(`${org?._id}`);
    })

    it("Returns all Classes of a given User", async () : Promise<void> => {
        const user = await User.findOne({});
        const reqTest = await request(app)
            .get(`/classes/user/${user?._id}`)
            .expect("Content-Type", 'application/json; charset=utf-8')
            .expect(200)
        expect(reqTest.body.classes[0].teachers[0]._id).toEqual(`${user?._id}`)
    })

    
})

describe("Class POST",() => {
    it("Creates class", async () : Promise<void> => {
        const org = await Org.findOne({});
        const user = await User.findOne({});
        const newClass = 
            {
            name: "Test Class",
            grade_level: "4",
            subject: "Test Subject",
            teachers: [user?._id],
            org: org?._id

        }
        const testReq = await request(app)
        .post(`/classes/create`)
        .set('Content-Type','application/json' )
        .send(newClass)
        .expect("Content-Type", 'application/json; charset=utf-8')
        .expect(201);
        expect(testReq.body.content.name).toEqual("Test Class")
    })


    it("Return 400 when creating class with invalid params", async () : Promise<void> => {
        const newClass = {};
        const testReq = await request(app)
        .post(`/classes/create`)
        .set('Content-Type','application/json' )
        .send(newClass)
        .expect(400)
        expect(testReq.body.message).toBe("Invalid parameters.")

    })
})

describe("Class PUT", ()=> {
    it("Edit class name/grade_level/subject", async () : Promise<void> => {
        const targetClass = await ClassModel.findOne({}).exec();
        const editContent = {
            name: "Edited Name",
            grade_level: "5",
            subject: "Math"
        }
        
        const editReq = await request(app)
            .put(`/classes/edit/${targetClass?._id}`)
            .set('Content-Type','application/json; charset=utf-8')
            .send(editContent)
            .expect(200)

        expect(editReq.body.message).toBe("Class information edited.");
        expect(editReq.body.content.name).toBe("Edited Name");
        expect(editReq.body.content.grade_level).toBe("5");
        expect(editReq.body.content.subject).toBe("Math");
    })

    it("Add teacher to class", async () : Promise<void> => {
        const org = await Org.findOne({});
        const newTeacher = new User({
            first_name: "Carl",
            last_name: "Walker",
            email: "carlwalker@gmail.com",
            password: "1234",
            gender: "M",
            verifed: true, 
            org: org?._id
        });
        const savedTeacher = await newTeacher.save();

        const targetClass = await ClassModel.findOne({}).lean().populate("teachers").exec();

        const editReq = await request(app)
            .put(`/classes/${targetClass?._id}/teachers/add`)
            .set('Content-Type','application/json; charset=utf-8')
            .send({_id: savedTeacher?._id})
            .expect(200)
        expect(editReq.body.message).toBe("Teacher added to class.") 
        
        const editedClass = await ClassModel.findOne({}).lean().populate("teachers").exec();

        const newTeachArr = editedClass?.teachers
        expect(newTeachArr?.some(t => t.toString() === savedTeacher._id.toString())).toBeTruthy
    })
    it("Removes teacher from class", async () : Promise<void> => {

        const targetClass = await ClassModel.findOne({}).lean().populate("teachers").exec();
        const teacherId  = targetClass?.teachers?.[0];

        const editReq = await request(app)
            .put(`/classes/${targetClass?._id}/teachers/remove`)
            .set('Content-Type','application/json; charset=utf-8')
            .send({_id: teacherId})
            .expect(200);
        expect(editReq.body.message).toBe("Teacher removed from class.")
        
        
        const editedClass = await ClassModel.findOne({}).lean().populate("teachers").exec();

        expect(editedClass?.teachers?.length).toEqual(0);

    } )
})


