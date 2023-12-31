import express, { IRouter } from 'express';
import incidentRouter from './incidentRouter.js';
import comRouter from './comRouter.js';
import pstRouter from './pstRouter.js';
import docFileRouter from './docFileRouter.js';

const router: IRouter = express.Router();

router.use('/incidents', incidentRouter);

router.use('/communications', comRouter);

router.use('/pst', pstRouter)

router.use('/docFiles', docFileRouter);

export default router;
