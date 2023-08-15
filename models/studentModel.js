import mongoose, { Schema } from "mongoose";

const studentSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	grade: Number,
	EL: Boolean,
	sped: Boolean,
	retained: Boolean,
	class: { type: Schema.Types.ObjectId, ref: "classes" },
});

studentSchema.virtual("").get(function () {
	return this.first_name + " " + this.last_name;
});

export default mongoose.model("students", studentSchema);
