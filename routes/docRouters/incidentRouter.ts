import express, { IRouter } from 'express';
import incidentController from './../../controllers/docTypes/incidentController.js';
import verifyToken from '../authentication/verifyToken.js';

const router: IRouter = express.Router();

router.get(
	'/instance/:incidentId',
	verifyToken,
	incidentController.get_incident
);

router.get(
	'/student/:studentId',
	verifyToken,
	incidentController.get_student_incidents
);

router.get(
	'/organization/:orgId',
	verifyToken,
	incidentController.get_org_incidents
);

router.get('/user', verifyToken, incidentController.get_user_incidents);

router.get('/class/:classId', verifyToken, incidentController.get_class_incidents);

export default router;
