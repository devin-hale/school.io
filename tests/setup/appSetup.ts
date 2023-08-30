import classRouter from '../../routes/classRouter.js'
import ClassModel from '../../models/classModel.js';
import User from '../../models/userModel.js';
import Org from '../../models/orgModel.js';import express, { Express, response } from 'express';

import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export default app
