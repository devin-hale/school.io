import express, { IRouter } from "express";
import incidentController from "./../../controllers/docTypes/incidentController.js";
import verifyToken from "../authentication/verifyToken.js";

const router: IRouter = express.Router();

router.get("/:incidentId", verifyToken, incidentController.get_incident);

//router.get("/:studentId", verifyToken, incidentController.get_student_incidents);

router.post("/create", incidentController.create_incident_record);

export default router;
