import classRouter from '../../routes/classRouter.js'
import Class from '../../models/classModel.js';
import User from '../../models/userModel.js';

import supertest from 'supertest';
import express, { Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import initializeTestDB from '../DB/testingSetup.js';

const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri();
mongoose.connect(uri);
await initializeTestDB();

const app : Express = express();

app.use(express.urlencoded({extended: false}));
app.use("/classes", classRouter);


test("Class Route", done => {
    supertest(app)
        .get(`/classes/1234`)
        .expect("Content-Type", /json/)
        .expect(200, done)
        })




await mongod.stop();

