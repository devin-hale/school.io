import express, { Router } from 'express';
import orgController from '../controllers/orgController';
import verifyToken from './authentication/verifyToken';

const router: Router = express.Router();

// Params : ?orgName=value
router.get('/search', verifyToken, orgController.search_orgs);

router.get('/instance/:orgId', verifyToken, orgController.get_org_instance);

router.get('/verifycode/:orgCode', orgController.org_code_verify);

router.post('/create', verifyToken, orgController.create_org);

router.put(
	'/instance/:orgId/editinfo',
	verifyToken,
	orgController.edit_org_info
);

router.put(
	'/instance/:orgId/editcolor',
	verifyToken,
	orgController.edit_org_color
);

router.delete('/instance/:orgId', verifyToken, orgController.delete_org);

export default router;
