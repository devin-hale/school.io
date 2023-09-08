import express, { Request, Response, Express } from "express";
import cors from 'cors';
import initializeMongoServer from "./config/mongoConfig.js";
import "dotenv/config.js";

import path from "path"
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError, { HttpError } from "http-errors";

import indexRouter from "./routes/indexRouter.js";
import orgRouter from './routes/orgRouter.js';
import userRouter from "./routes/userRouter.js"
import classRouter from "./routes/classRouter.js";
import studentRouter from "./routes/studentRouter.js";
import docRouter from "./routes/docRouters/docRouter.js";

import logTypes from "./config/chalkConfig.js";

//Workaround for __dirname with modules
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const PORT: number = parseInt(process.env.PORT!) || 3000;

initializeMongoServer();

const app: Express = express();

//Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


//Routes
app.options("*", cors());
app.use("/", indexRouter);
app.use("/organizations", orgRouter);
app.use("/users", userRouter)
app.use("/classes", classRouter);
app.use("/students", studentRouter);
app.use("/docs", docRouter);

app.use((req, res, next) => {
	next(createError(404));
});
app.use((err: HttpError, req: Request, res: Response): void => {
	res.locals.message = err.message;
	//res.locals.error = req.app.get("env") === "development" ? err : {};
	res.status(err.status);
	res.send({ error: err });
});

app.listen(PORT, () => {
	console.log(logTypes.success(`school.io server started on `) + logTypes.alert(`PORT: ${PORT}`));
});
