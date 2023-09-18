import express from 'express';
import pstController from '../../controllers/docTypes/pstController';
import verifyToken from '../authentication/verifyToken';

const router = express.Router();

router.get('/:pstId', verifyToken, pstController.get_pst_instance);

export default router;
