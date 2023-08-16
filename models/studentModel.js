import mongoose, { Schema } from "mongoose";

const studentSchema = new mongoose.Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	grade_level: { type: Number, required: true },
	gifted: Boolean,
	retained: Boolean,
	sped: Boolean,
	english_language_leaner: Boolean,
	classes: [{ type: Schema.Types.ObjectId, ref: "classes" }],
});

studentSchema.virtual("fullName").get(function () {
	return this.first_name + " " + this.last_name;
});

export default mongoose.model("students", studentSchema);
