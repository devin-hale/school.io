import mongoose, { ObjectId, Schema } from 'mongoose';

export interface StudentInterface {
	_id: ObjectId;
	first_name: string;
	last_name: string;
	grade_level: string;
	gifted: Boolean;
	retained: Boolean;
	sped: Boolean;
	english_language_learner: Boolean;
	classes?: ObjectId[];
	org: ObjectId;
	active: Boolean;
}

const studentSchema: Schema = new mongoose.Schema<StudentInterface>({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	grade_level: { type: String, required: true },
	gifted: Boolean,
	retained: Boolean,
	sped: Boolean,
	english_language_learner: Boolean,
	classes: [{ type: Schema.Types.ObjectId, ref: 'classes' }],
	org: { type: Schema.Types.ObjectId, ref: 'organizations' },
	active: { type: Boolean, default: true },
});

studentSchema.virtual('url').get(function(): string {
	return `/students/${this._id}`;
});

studentSchema.virtual('fullName').get(function(): string {
	return `${this.first_name} ${this.last_name}`;
});

export default mongoose.model<StudentInterface>('students', studentSchema);
