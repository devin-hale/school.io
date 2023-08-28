import mongoose, { ObjectId, Schema } from "mongoose";

interface IClass {
    name: string,
    grade_level: string,
    subject?: string,
    teachers?: ObjectId[]
    org: ObjectId
}


const classSchema = new mongoose.Schema<IClass>(
	{
		name: { type: String, required: true },
		grade_level: { type: String, required: true },
		subject: String,
		teachers: [{ type: Schema.Types.ObjectId, ref: "users" }],
        org: {type: Schema.Types.ObjectId, ref: "organizations"}
	},
	{ collection: "classes" }
);

export default mongoose.model<IClass>("classes", classSchema);
