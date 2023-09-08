import ClassModel, { ClassInterface } from '../../models/classModel.js';
import User, { UserInterface } from '../../models/userModel.js';
import Org, { OrgInterface } from '../../models/orgModel.js';

import app from '../setup/appSetup.js'

import request, { Response } from 'supertest';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Document, ObjectId } from 'mongoose';
import initializeTestDB from '../setup/dbSetup.js';
import studentModel, { StudentInterface } from '../../models/studentModel.js';

let mongod: MongoMemoryServer

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

describe("Org GET", (): void => {
    it("Queries org (200)", async (): Promise<void> => {
        const searchTerm: string = "Test+Org";

        const searchReq: Response = await request(app)
            .get(`/organizations/search?orgName=${searchTerm}`)
            .set('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(searchReq.body.searchResults.length).toBe(1)
    })
    it("Gets org instance (201)", async (): Promise<void> => {
        const targetOrg: OrgInterface | null = await Org.findOne({}).lean().exec();

        const getReq: Response = await request(app)
            .get(`/organizations/instance/${targetOrg?._id}`)
            .set('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(getReq.body.org._id).toEqual(targetOrg?._id.toString());
    });
    it("Fails when Org not found (404)", async (): Promise<void> => {

        await request(app)
            .get(`/organizations/instance/64ebe2c3ad586fd7e48f93b5`)
            .set('Content-Type', 'application/json; charset=utf-8')
            .expect(404);

    });
    it("Checks for valid org code (200)", async (): Promise<void> => {
        const targetOrg: OrgInterface | null = await Org.findOne({}).lean().exec();

        const getReq: Response = await request(app)
            .get(`/organizations/verifycode/${targetOrg?.orgCode}`)
            .set('Content-Type', 'application/json; charset=utf-8')
            .expect(200);

        expect(getReq.body.org._id).toBe(targetOrg?._id.toString());
    })
});
describe("Org POST", (): void => {
    it("Creates Org (200)", async (): Promise<void> => {
        const newOrg = {
            name: "Test High School"
        }

        const postReq: Response = await request(app)
            .post(`/organizations/create`)
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(newOrg)
            .expect("Content-Type", 'application/json; charset=utf-8')
            .expect(201);

        const orgExists: OrgInterface | null = await Org.findOne({ _id: postReq.body.org._id });

        expect(orgExists).toBeTruthy;
    });
});

describe("Org PUT", (): void => {
    it("Edits Org Info (200)", async (): Promise<void> => {
        const targetOrg: OrgInterface | null = await Org.findOne({ name: "Test High School" }).lean().exec();
        const editedInfo = {
            name: "Edited School"
        }

        await request(app)
            .put(`/organizations/instance/${targetOrg?._id}/editinfo`)
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(editedInfo)
            .expect(200);

        const editedOrg: OrgInterface | null = await Org.findOne({ name: "Edited School" }).lean().exec();

        expect(editedOrg).toBeTruthy;
    });
    it("Edits Org Color (200)", async (): Promise<void> => {
        const targetOrg: OrgInterface | null = await Org.findOne({ name: "Edited School" }).lean().exec();
        const editedInfo = {
            color: "red"
        }

        await request(app)
            .put(`/organizations/instance/${targetOrg?._id}/editcolor`)
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(editedInfo)
            .expect(200);

        const editedOrg: OrgInterface | null = await Org.findOne({ name: "Edited School" }).lean().exec();

        expect(editedOrg?.color).toBe("red")
    });
})
