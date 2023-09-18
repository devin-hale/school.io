import express, { IRouter } from 'express';
import incidentRouter from './incidentRouter.js';
import comRouter from './comRouter.js';

const router: IRouter = express.Router();

router.use('/incidents', incidentRouter);

router.use('/communications', comRouter);

export default router;
