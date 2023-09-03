import express, { Router } from 'express';
import userController from '../controllers/userController.js';

const router : Router = express.Router();

// TODO: GET route for searching all users with varying terms

router.get('/organization/:orgId', userController.find_all_by_org)

router.get('/:userId', userController.get_user);

router.post('/create', userController.create_account);

// TODO: PUT route to swap user to verified

router.put(`/edit/:userId`, userController.edit_user_info);

router.put(`/:userId/email/edit`, userController.edit_email);

router.put(`/:userId/password/edit`, userController.edit_password);

router.delete(`/:userId/delete`, userController.delete_user);

export default router
