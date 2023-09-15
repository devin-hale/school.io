import mongoose, { ObjectId, Schema } from 'mongoose';

export interface IncidentInterface {
	_id: ObjectId;
	owner: ObjectId;
	access?: ObjectId[];
	date_of_occurence: Date;
	staff_involved?: ObjectId[];
	students_involved?: ObjectId[];
	parents_involved?: string[];
	others_involved?: string[];
	subject: string;
	description?: string;
	action_taken?: string;
	parentOrGuardian_notified: boolean;
	notification_type: string;
	escalated: boolean;
	org: ObjectId;
}

const incidentModel: Schema = new mongoose.Schema<IncidentInterface>(
	{
		owner: { type: Schema.Types.ObjectId, ref: 'users', required: true },
		access: [{ type: Schema.Types.ObjectId, ref: 'users' }],
		date_of_occurence: { type: Date, required: true },
		staff_involved: [{ type: Schema.Types.ObjectId, ref: 'users' }],
		students_involved: [{ type: Schema.Types.ObjectId, ref: 'students' }],
		parents_involved: [{ type: String }],
		others_involved: [{ type: String }],
		subject: { type: String, required: true },
		description: { type: String },
		action_taken: String,
		parentOrGuardian_notified: Boolean,
		notification_type: {
			Type: String,
			enum: ['Email', 'Phone', 'Text', 'Remind', 'SocialMedia', 'Other'],
		},
		escalated: Boolean,
		org: { type: Schema.Types.ObjectId, ref: 'organizations' },
	},
	{ collection: 'incidents' }
);

export default mongoose.model<IncidentInterface>('incidents', incidentModel);
