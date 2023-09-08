import mongoose, { Schema, ObjectId } from "mongoose";
import codeGen from "./utils/codeGen.js";

export interface EmailAuthInterface {
	_id: ObjectId,
    user: ObjectId,
    code: () => string;
}


const emailAuthSchema : Schema = new mongoose.Schema<EmailAuthInterface>(
	{
		user: { type: Schema.Types.ObjectId, ref: "users" },
		code: { type: String, default: codeGen },
	},
	{ collection: "emailAuth" }
);

export default mongoose.model<EmailAuthInterface>("emailAuth", emailAuthSchema);
