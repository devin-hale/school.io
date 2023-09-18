import PST, {
	PSTInterface,
	PSTHeaderInterface,
	PSTWeekInterface,
} from './../../models/docTypes/pstModel';
import asyncHandler from 'express-async-handler';
import { RequestHandler } from 'express';
import { body, param, validationResult, Result, ValidationError } from 'express-validator';

const get_pst_instance: RequestHandler[] = [
	param('pstId').trim().escape(),

	asyncHandler(async (req, res, next): Promise<void> => {
		const errors: Result = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({
				message: 'Invalid request.',
				errors: errors.array().map((e: ValidationError) => e.msg),
			});
		} else {
			try {
				const pstInstance : PSTInterface | null = await PST.findOne({_id: req.params.pstId});

				if (!pstInstance) {
					res.status(404).json({message: "PST Document not found."})
				} else {
					res.json(pstInstance);
				}
			} catch (error) {
				next(error)
			}
		}
	}),
];

export default {
	get_pst_instance
}
