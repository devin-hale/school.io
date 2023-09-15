import mongoose, { ObjectId, Schema } from 'mongoose';

export interface ClassInterface {
	_id: ObjectId;
	name: string;
	grade_level: string;
	subject?: string;
	teachers?: ObjectId[];
	org: ObjectId;
}

const classSchema: Schema = new mongoose.Schema<ClassInterface>(
	{
		name: { type: String, required: true },
		grade_level: { type: String, required: true },
		subject: String,
		teachers: [{ type: Schema.Types.ObjectId, ref: 'users' }],
		org: { type: Schema.Types.ObjectId, ref: 'organizations' },
	},
	{ collection: 'classes' }
);

export default mongoose.model<ClassInterface>('classes', classSchema);
