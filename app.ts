import express, { NextFunction, Request, Response, Errback } from "express";
import initializeMongoServer from "./config/mongoConfig.js";
import "dotenv/config.js";

import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError, { HttpError } from "http-errors";

import indexRouter from "./routes/indexRouter.js";
import classRouter from "./routes/classRouter.js";
import studentRouter from "./routes/studentRouter.js";
import docRouter from "./routes/docRouters/docRouter.js";

import passport from "passport";
import session from "express-session";
import flash from "connect-flash";
import checkUser from "./routes/authentication/sessionAuth.js";

import logTypes from "./config/chalkConfig.js";

//Workaround for __dirname with modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT!) || 3000;

initializeMongoServer();

const app = express();

//Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
	session({
		secret: "cats",
		resave: false,
		saveUninitialized: true,
	})
);
app.use(flash());
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/", indexRouter);
app.use("/classes", checkUser.checkUser, classRouter);
app.use("/students", checkUser.checkUser, studentRouter);
app.use("/docs", checkUser.checkUser, docRouter);

//error MW
app.use((req, res, next) => {
	next(createError(404));
});
app.use((err : HttpError, req : Request, res: Response, next : NextFunction) : void => {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};
	res.status(err.status || 500);
	res.render("error", { error: err });
});

app.listen(PORT, () => {
	console.log(logTypes.success(`school.io server started on `) + logTypes.alert(`PORT: ${PORT}`));
});
