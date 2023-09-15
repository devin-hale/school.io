import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import logTypes from './chalkConfig.js';

async function initializeMongoServer() {
	const mongoServer: MongoMemoryServer = await MongoMemoryServer.create();
	const mongoUri: string = mongoServer.getUri();

	mongoose.connect(mongoUri);

	mongoose.connection.on('error', (error): void => {
		if (error.message.code === 'ETIMEDOUT') {
			console.log(error);
			mongoose.connect(mongoUri);
		}
		console.log(error);
	});

	mongoose.connection.once('open', (): void => {
		console.log(
			logTypes.success(`Connected to school.io Database :`) +
			logTypes.alert('TESTING')
		);
	});
}

export default initializeMongoServer;
