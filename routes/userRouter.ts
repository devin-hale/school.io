import express, { Router } from 'express';
import userController from '../controllers/userController.js';

const router : Router = express.Router();

router.get('/:userId', userController.get_user);

export default router
