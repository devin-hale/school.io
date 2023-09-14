import express, { IRouter } from "express";
import incidentController from "./../../controllers/docTypes/incidentController.js";
import verifyToken from "../authentication/verifyToken.js";

const router: IRouter = express.Router();

router.get("/:incidentId", verifyToken, incidentController.get_incident);

router.get("/student/:studentId", verifyToken, incidentController.get_student_incidents);

export default router;
