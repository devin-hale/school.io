import mongoose, { Schema } from "mongoose";

const comModel = mongoose.Schema(
	{
		owner: { type: Schema.Types.ObjectId, ref: "users", required: true },
		access: [{ type: Schema.Types.ObjectId, ref: "users" }],
		communication_type: {
			type: String,
			enum: [
				"Staff to Staff",
				"Staff to Parent",
				"Staff to Student",
				"Staff to Other",
			],
			required: true,
		},
		date_of_occurence: Date,
		staff_involved: [{ type: Schema.Types.ObjectId, ref: "users" }],
		students_involved: [{ type: Schema.Types.ObjectId, ref: "students" }],
		parents_involved: { type: String },
		others_involved: { type: String },
		subject: { type: String, required: true },
		notes: { type: String },
		followUp: Boolean,
		followUp_date: Date,
	},
	{ collection: "communications" }
);

export default mongoose.model("communications", comModel);