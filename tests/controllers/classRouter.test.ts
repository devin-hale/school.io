import classRouter from '../../routes/classRouter.js'
import Class from '../../models/classModel.js';

import supertest from 'supertest';
import express, { Express } from 'express';
import initializeMongoServer from '../../config/mongoConfigTesting.js';


//initializeMongoServer();

const app : Express = express();

app.use(express.urlencoded({extended: false}));
app.use("/classes", classRouter);




test("Class Route", done => {
    supertest(app)
        .get("/classes")
        .expect("Content-Type", /json/)
        .expect({class: "pee"})
        .expect(200, done)
        })






