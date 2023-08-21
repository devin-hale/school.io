import express from "express";
import incidentRouter from "./incidentRouter.js";
import checkUser from "./../authentication/sessionAuth.js";

const router = express.Router();

//incidents
router.use("/incident", checkUser.checkUser, incidentRouter);

export default router;