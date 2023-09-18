import express from 'express';
import pstController from '../../controllers/docTypes/pstController';
import verifyToken from '../authentication/verifyToken';

const router = express.Router();

router.get('/:pstId', verifyToken, pstController.get_pst_instance);

router.get('/user/:userId', verifyToken, pstController.get_user_pst);

//TODO:
//get by user
//get by org
//get by class
//post create pst
//post add week
//put edit pst header
//put edit pst week
//put edit pst access
//put remove pst week
//delete pst

export default router;
