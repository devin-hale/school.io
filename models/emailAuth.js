import mongoose, { Schema } from "mongoose";
import codeGen from "./utils/codeGen.js";

const emailAuthSchema = new mongoose.Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "users" },
		code: { type: String, default: codeGen },
	},
	{ collection: "emailAuth" }
);

export default mongoose.model("emailAuth", emailAuthSchema);
