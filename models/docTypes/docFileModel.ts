import mongoose, { ObjectId, Schema } from 'mongoose';

export interface FileInterface {
	_id: ObjectId;
	//owner: string;
	owner: ObjectId;
	filename: string;
	docType: 'pst' | 'communications' | 'incidents';
	docId: string;
}

const docFileSchema: Schema = new mongoose.Schema<FileInterface>(
	{
		//owner: { type: String, ref: 'users' },
		owner: {type: Schema.Types.ObjectId, ref: 'users'},
		filename: { type: String, required: true },
		docType: {
			type: String,
			enum: ['pst', 'communications', 'incidents'],
			required: true,
		},
		docId: String,
	},
	{ collection: 'docFiles' }
);

export default mongoose.model<FileInterface>('docFiles', docFileSchema);
