import express, { IRouter } from 'express';
import incidentRouter from './incidentRouter.js';
import comRouter from './comRouter.js';

const router: IRouter = express.Router();

//incidents
router.use('/incidents', incidentRouter);

//communications
router.use('/communication', comRouter);
export default router;
