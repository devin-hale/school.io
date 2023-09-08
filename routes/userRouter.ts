import express, { Router } from 'express';
import userController from '../controllers/userController.js';

const router : Router = express.Router();

// Query params : ?search=value  Currently works on names
router.get('/search', userController.search_user);

router.get('/organization/:orgId', userController.find_all_by_org)

router.get('/:userId', userController.get_user);

router.get("/:userId/classes", userController.get_user_classes);

router.post('/create', userController.create_account);

router.put(`/edit/:userId`, userController.edit_user_info);

router.put(`/:userId/email/edit`, userController.edit_email);

router.put(`/:userId/password/edit`, userController.edit_password);

router.put('/:userId/verify', userController.verify_user);

router.delete(`/:userId/delete`, userController.delete_user);

export default router
