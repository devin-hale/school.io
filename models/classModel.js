import mongoose, { Schema } from "mongoose";

const classSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		grade_level: { type: String, required: true },
		subject: String,
		teachers: [{ type: Schema.Types.ObjectId, ref: "users" }],
	},
	{ collection: "classes" }
);

export default mongoose.model("classes", classSchema);
