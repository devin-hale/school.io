import express from "express";
import incidentController from "./../../controllers/docTypes/incidentController.js";

const router = express.Router();

// GET :: Incident Instance
router.get("/:incidentId", incidentController.get_incident_record);

// POST -> Render to Creation Form
router.post(
	"/form/:userId/:studentId",
	incidentController.populate_incident_creation_form
);

// POST :: Create Incident Report

router.post("/create", incidentController.create_incident_record);

export default router;
