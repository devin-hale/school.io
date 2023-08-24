import express from "express";
import incidentRouter from "./incidentRouter.js";
import comRouter from "./comRouter.js"
import checkUser from "./../authentication/sessionAuth.js";

const router = express.Router();

//incidents
router.use("/incident", checkUser.checkUser, incidentRouter);

//communications
router.use("/communication", checkUser.checkUser, comRouter);
export default router;
