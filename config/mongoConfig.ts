import mongoose from "mongoose";
import "dotenv/config.js";
import logTypes from "./chalkConfig.js";


const DBSTRING : string =
	process.env.NODE_ENV === "dev"
		? `${process.env.DBLINK! + process.env.DBDEV}`
		: `${process.env.DBLINK! + process.env.DB}`;

//DB Connection

async function initializeMongoServer() {
	
    mongo().catch((error) : void => console.log(error));

	async function mongo() {
	await mongoose.connect(DBSTRING);
	}

	mongoose.connection.on(
	"error",
	console.error.bind(console, "MongoDB connection error")
	);

	mongoose.connection.once("open", () : void => {
        console.log(logTypes.success(`Connected to SchoolDocs Database : `) + logTypes.alert(`${process.env.NODE_ENV === "dev" ? "STAGING" : "PRODUCTION"}`));
    })
}

export default initializeMongoServer;