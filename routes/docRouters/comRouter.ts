import express from 'express';
import comController from '../../controllers/docTypes/comController.js';
import verifyToken from '../authentication/verifyToken.js';

const router = express.Router();

router.get('/:commId', verifyToken, comController.get_communication_instance);

router.get('/user/:userId', verifyToken, comController.get_user_comms);

router.post('/create', verifyToken, comController.create_communication);

router.put('/:commId/editInf', verifyToken, comController.edit_communication_info);

export default router;
