import express from 'express';
import indexController from '../controllers/indexController.js';

const router = express.Router();

//Optional stay logged in param : ?stayLogged=true
router.post(`/login`, indexController.user_login);

router.post('/authenticate', indexController.return_user);

export default router;
