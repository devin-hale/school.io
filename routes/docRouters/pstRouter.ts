import express from 'express';
import pstController from '../../controllers/docTypes/pstController';
import verifyToken from '../authentication/verifyToken';

const router = express.Router();

router.get('/:pstId', verifyToken, pstController.get_pst_instance);

router.get('/org/:orgId', verifyToken, pstController.get_org_pst);

router.get('/user/:userId', verifyToken, pstController.get_user_pst);

router.get('/class/:classId', verifyToken, pstController.get_class_pst);

router.get('/student/:studentId', verifyToken, pstController.get_student_pst);

router.post('/create', verifyToken, pstController.create_pst);

router.post('/:pstId/addStudent', verifyToken, pstController.add_student);

router.post('/:pstId/addWeek', verifyToken, pstController.add_week);

router.put('/:pstId/header', verifyToken, pstController.edit_header);

//TODO:
//put edit pst header
//put edit pst week
//put edit pst access
//put remove pst week
//delete pst

export default router;
