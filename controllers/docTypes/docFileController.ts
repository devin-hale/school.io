import DocFile, {
	FileInterface as DocFileInterface,
} from '../../models/docTypes/docFileModel.js';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

const upload_file: RequestHandler = asyncHandler(
	async (req, res, next): Promise<void> => {
		try {
			const file = {
				owner: req.params.userId,
				filename: req.file?.filename,
				docType: req.params.docType,
				[`${req.params.docType}`]: req.params.docId,
			};

			const savedFile = await DocFile.create(file);

			res.status(201).json({ message: 'Upload successful.' });
		} catch (error) {
			next(error);
		}
	}
);

const get_fileList: RequestHandler = asyncHandler(
	async (req, res, next): Promise<void> => {
		try {
			const fileList = fs.readdirSync(
				`storage/${req.params.userId}/${req.params.docType}/${req.params.docId}`
			);

			console.log(fileList);

			res.json(fileList);
		} catch (error) {
			next(error);
		}
	}
);

const send_file: RequestHandler = asyncHandler(
	async (req, res, next): Promise<void> => {
		try {
			res.download(
				path.join(
					__dirname,
					`../../../storage/${req.params.userId}/${req.params.docType}/${req.params.docId}/${req.params.fileName}`
				)
			);
		} catch (error) {
			next(error);
		}
	}
);

const delete_file: RequestHandler = asyncHandler(
	async (req, res, next): Promise<void> => {
		try {
			fs.rm(
				path.join(
					__dirname,
					`../../../storage/${req.params.userId}/${req.params.docType}/${req.params.docId}/${req.params.fileName}`
				),
				{},
				(error) => {
					if (error) {
						console.log(error);
					}
				}
			);

			const deletedRecord = await DocFile.findOneAndDelete({
				filename: req.params.fileName,
				docType: req.params.docType,
				docId: req.params.docId,
			});
			res.json({ message: 'Deletion successful.' });
		} catch (error) {
			next(error);
		}
	}
);

export default { upload_file, send_file, get_fileList, delete_file };
