import classRouter from '../../routes/classRouter.js'
import ClassModel from '../../models/classModel.js';
import User from '../../models/userModel.js';
import Org from '../../models/orgModel.js';

import request from 'supertest';
import express, { Express, response } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose  from 'mongoose';
import initializeTestDB from '../DB/testingSetup.js';

import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError  from "http-errors";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



let mongod: MongoMemoryServer

const app : Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/classes", classRouter);

app.use((req:any, res:any, next:any, err:any)=> {
    next(createError(404))
})
app.use((req:any, res: any, next:any, err: any) : void => {
	res.locals.message = err.message;
	res.status(err.status);
	res.send({ error: err });
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

    it("Returns a specific Class", async () => {
        const classInstance = await ClassModel.findOne({});
        const response = await request(app)
            .get(`/classes/${classInstance?._id}`)
            .expect("Content-Type", /json/)
            .expect(200)
        expect(response.body.classInstance._id).toBe(`${classInstance?._id}`)
    })

    it("404 when class not found", async () => {
         await request(app)
            .get(`/classes/64ebe2c3ad586fd7e48f93b5`)
            .expect(404)
    })

    it("Returns all Classes of a given Org", async()=> {
        const org = await Org.findOne({});
        const reqTest = await request(app)
            .get(`/classes/org/${org?._id}`)
            .expect("Content-Type", 'application/json; charset=utf-8')
            .expect(200)
        expect(reqTest.body.classes[0].org).toBe(`${org?._id}`);
    })

    it("Returns all Classes of a given User",async () => {
        const user = await User.findOne({});
        const reqTest = await request(app)
            .get(`/classes/user/${user?._id}`)
            .expect("Content-Type", 'application/json; charset=utf-8')
            .expect(200)
        expect(reqTest.body.classes[0].teachers[0]._id).toEqual(`${user?._id}`)
    })

    
})

describe("Class POST",() => {
    it("Creates class", async () => {
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



})




