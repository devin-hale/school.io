import mongoose, { Schema } from "mongoose";
import codeGen from "./utils/codeGen.js";

const emailAuthModel = new mongoose.Schema({
	user: { type: Schema.Types.ObjectId, ref: "users" },
	code: { type: String, default: codeGen },
});

export default mongoose.model("emailAuth", emailAuthModel);
