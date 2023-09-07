import express, { Router } from 'express';
import orgController from '../controllers/orgController';

const router : Router = express.Router();

// Params : ?orgName=value
router.get("/search", orgController.search_orgs);

router.get("/instance/:orgId", orgController.get_org_instance);

router.get("/verifycode/:orgCode", orgController.org_code_verify);

router.post("/create", orgController.create_org);

//TODO: Edit Name, Edit Color
//Delete, 

export default router
