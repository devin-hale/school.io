import mongoose, { ObjectId, Schema } from "mongoose";

export interface CommInterface {
	_id: ObjectId,
    owner: ObjectId,
    access?: ObjectId[],
    communication_type: "Staff to Staff" | "Staff to Parent" | "Staff to Student" | "Staff to Other",
    date_of_occurence: Date,
    staff_involved?: ObjectId[],
    students_involved?: ObjectId[],
    parents_involved?: ObjectId[],
    others_involved?: ObjectId[],
    subject: string,
    description?: string,
    followUp: boolean,
    followUp_date?: Date
}

const comModel : Schema = new mongoose.Schema<CommInterface>(
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
		description: { type: String },
		followUp: {type: Boolean, required: true},
		followUp_date: Date,
	},
	{ collection: "communications" }
);

export default mongoose.model<CommInterface>("communications", comModel);


