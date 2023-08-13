import express from "express";
import mongoose from "mongoose";
import "dotenv/config.js";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import { fileURLToPath } from "url";
import indexRouter from "./routes/indexRouter.js";

//Workaround for __dirname with modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Import env variables
const PORT = parseInt(process.env.PORT) || 3000;
const DBSTRING =
	process.env.NODE_ENV === "dev"
		? `${process.env.DBLINK + process.env.DBDEV}`
		: `${process.env.DBLINK + process.env.DB}`;

//DB Connection
mongo().catch((err) => console.log(err));
async function mongo() {
	await mongoose.connect(DBSTRING);
}

//Server
const app = express();

//View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", indexRouter);

//error MW
app.use((req, res, next) => {
	next(createError(404));
});
app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};
	res.status(err.status || 500);
	res.render("error");
});

//Start server
app.listen(PORT, () => {
	console.log(`Server started on PORT: ${PORT}`);
});
