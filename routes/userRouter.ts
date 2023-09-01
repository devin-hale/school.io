import express, { Router } from 'express';
import userController from '../controllers/userController.js';

const router : Router = express.Router();

// TODO: GET route for searching all users with varying terms

// TODO: GET route for pull all users by orgId

router.get('/:userId', userController.get_user);

router.post('/create', userController.create_account);

// TODO: PUT route to swap user to verified

router.put(`/edit/:userId`, userController.edit_user_info);

router.put(`/:userId/email/edit`, userController.edit_email);

router.put(`/:userId/password/edit`, userController.edit_password);

// TODO: Delete route. Needs to remove all refs from all instances of classModel.teachers[]

export default router
