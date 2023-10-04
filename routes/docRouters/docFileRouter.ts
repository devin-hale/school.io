import express, { IRouter } from 'express';
import verifyToken from '../authentication/verifyToken.js';
import multer, { Multer, StorageEngine } from 'multer';
import docFileController from '../../controllers/docTypes/docFileController.js';
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);



const storage: StorageEngine = multer.diskStorage({
	destination: (req, file, cb) => {
		const filePath  = `storage/${req.params.userId}/${req.params.docType}/${req.params.docId}/`;

		fs.mkdirSync(filePath, { recursive: true });
		cb(null, filePath );
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}` );
	},
});

const upload: Multer = multer({ storage: storage });

const router: IRouter = express.Router();

router.get('/:userId/:docType/:docId/:fileName', verifyToken, docFileController.send_file);

router.get('/:userId/:docType/:docId', verifyToken, docFileController.get_fileList);

router.post(
	'/:userId/:docType/:docId',
	verifyToken,
	upload.single('file'),
	docFileController.upload_file,
);

router.delete('/:userId/:docType/:docId/:fileName', verifyToken, docFileController.delete_file);

export default router;
