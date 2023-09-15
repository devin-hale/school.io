import express, { Router } from 'express';
import classController from '../controllers/classController.js';
import verifyToken from './authentication/verifyToken.js';

const router: Router = express.Router();

// Query params: ?teacher=value, name=value, subject=value
router.get('/search', verifyToken, classController.search_class);

router.get('/:classId', verifyToken, classController.get_class_instance);

//TODO : Swap this to make it an org route.
router.get('/org/:orgId', verifyToken, classController.get_org_classes);

router.post('/create', verifyToken, classController.create_class);

router.put('/edit/:classId', verifyToken, classController.edit_class);

router.put('/:classId/teachers/add', verifyToken, classController.add_teacher);

router.put(
	'/:classId/teachers/remove',
	verifyToken,
	classController.remove_teacher
);

router.delete('/:classId/delete', verifyToken, classController.delete_class);

export default router;
