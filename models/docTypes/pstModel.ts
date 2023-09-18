import mongoose, { Schema, ObjectId } from 'mongoose';

export interface PSTHeaderInterface {
	student: ObjectId;
	schoolYear: string;
	intervention_type: 'Reading' | 'Math' | 'Behavior';
	west_virginia_phonics: string;
	readingIXL: string;
	progress_monitoring_goal: string;
}

export interface PSTWeekInterface {
	weekNo: number;
	dates: string;
	attendance: {
		monday: string;
		tuesday: string;
		wednesday: string;
		thursday: string;
		friday: string;
	};
	tier1: string[];
	tier2: string[];
	parentComm: string[];
	progressMonitor: string[];
}

export interface PSTInterface {
	_id: ObjectId;
	owner: ObjectId;
	org: ObjectId;
	class: ObjectId;
	access?: ObjectId[];
	header: PSTHeaderInterface;
	weeks: PSTWeekInterface[];
}

const pstModel: Schema = new mongoose.Schema<PSTInterface>(
	{
		owner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
		org: { type: Schema.Types.ObjectId, ref: 'organizations', required: true },
		class: {type: Schema.Types.ObjectId, ref: 'classes', required: true},
		access: [{ type: Schema.Types.ObjectId, ref: 'users' }],
		header: {
			student: { type: Schema.Types.ObjectId, ref: 'students' },
			schoolYear:{type: String, default: ''} ,
			intervention_type: {
				type: String,
				enum: ['Reading', 'Math', 'Behavior'],
				default: 'Reading',
			},
			west_virginia_phonics: {type: String, default: ''},
			readingIXL: {type: String, default: ''},
			progress_monitoring_goal: {type: String, default: ''},
		},
		weeks: [
			{
				weekNo: Number,
				dates: String,
				attendance: {
					monday: String,
					tuesday: String,
					wednesday: String,
					thursday: String,
					friday: String,
				},
				tier1: [String],
				tier2: [String],
				parentComm: [String],
				progressMonitor: [String],
			},
		],
	},
	{ collection: 'pst' }
);

export default mongoose.model<PSTInterface>('pst', pstModel);
