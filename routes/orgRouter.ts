import express, { Router } from 'express';
import orgController from '../controllers/orgController';

const router: Router = express.Router();

// Params : ?orgName=value
router.get("/search", orgController.search_orgs);

router.get("/instance/:orgId", orgController.get_org_instance);

router.get("/verifycode/:orgCode", orgController.org_code_verify);

router.post("/create", orgController.create_org);

router.put("/instance/:orgId/editinfo", orgController.edit_org_info);

router.put("/instance/:orgId/editcolor", orgController.edit_org_color);

//Delete, 

export default router
