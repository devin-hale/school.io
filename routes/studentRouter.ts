import express from 'express';
import studentController from './../controllers/studentController.js';
import verifyToken from './authentication/verifyToken.js';

const router = express.Router();

// Search params: ?name=First+Last, split in the controller
router.get('/search', verifyToken, studentController.search_student);

router.get('/:studentId', verifyToken, studentController.get_student_info);

router.get('/org/:orgId', verifyToken, studentController.get_org_students);

router.get(
	`/class/:classId`,
	verifyToken,
	studentController.get_class_students
);

router.post(`/create`, verifyToken, studentController.create_student);

router.put(
	'/:studentId/edit',
	verifyToken,
	studentController.edit_student_info
);

router.put(
	'/:studentId/classAdd/:classId',
	verifyToken,
	studentController.student_add_class
);

router.put(
	'/:studentId/classRemove/:classId',
	verifyToken,
	studentController.student_remove_class
);

router.put(
	'/:studentId/toggleActive',
	verifyToken,
	studentController.toggle_active
);

router.delete('/:studentId', verifyToken, studentController.delete_student);

export default router;
