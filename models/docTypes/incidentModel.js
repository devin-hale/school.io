import mongoose, { Schema } from "mongoose";

const incidentModel = mongoose.Schema(
	{
		owner: { type: Schema.Types.ObjectId, ref: "users", required: true },
		access: [{ type: Schema.Types.ObjectId, ref: "users" }],
		date_of_occurence: Date,
		staff_involved: [{ type: Schema.Types.ObjectId, ref: "users" }],
		students_involved: [{ type: Schema.Types.ObjectId, ref: "students" }],
		parents_involved: { type: String },
		others_involved: { type: String },
		subject: { type: String, required: true },
		description: { type: String },
		action_taken: String,
		parentOrGuardian_notified: Boolean,
		notification_type: {
			Type: String,
			enum: ["Email", "Phone Call", "Text", "Remind", "Social Media", "Other"],
		},
		escalated: Boolean,
	},
	{ collection: "incidents" }
);

export default mongoose.model("incidents", incidentModel);
