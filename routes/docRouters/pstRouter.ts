import express from 'express';
import pstController from '../../controllers/docTypes/pstController.js';
import verifyToken from '../authentication/verifyToken.js';

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

router.put('/:pstId/week/:weekNo', verifyToken, pstController.edit_week);

router.put('/:pstId/editAccess', verifyToken, pstController.edit_access);

router.delete('/:pstId/week/:weekNo', verifyToken, pstController.delete_week);

router.delete('/:pstId/delete', verifyToken, pstController.delete_pst);

//TODO:
//put remove pst week
//delete pst

export default router;
