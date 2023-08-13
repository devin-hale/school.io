import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import indexRouter from "./routes/indexRouter.js";

//Workaround for __dirname with modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Import env variables
const PORT = process.env.PORT || 3000;
const DBSTRING =
	process.env.DBLINK === "PROD" ? process.env.PROD_DB : process.env.DEV_DB;

//Express
const app = express();

//View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Routes
app.use("/", indexRouter);

//Start server
app.listen(PORT, () => {
	console.log(`Server started on PORT: ${PORT}`);
});
