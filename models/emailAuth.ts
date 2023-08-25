import mongoose, { Schema, ObjectId } from "mongoose";
import codeGen from "./utils/codeGen.js";

interface IEmailAuth {
    user: ObjectId,
    code: () => string;
}


const emailAuthSchema = new mongoose.Schema<IEmailAuth>(
	{
		user: { type: Schema.Types.ObjectId, ref: "users" },
		code: { type: String, default: codeGen },
	},
	{ collection: "emailAuth" }
);

export default mongoose.model<IEmailAuth>("emailAuth", emailAuthSchema);
