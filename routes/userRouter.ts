import express, { Router } from 'express';
import userController from '../controllers/userController.js';
import verifyToken from './authentication/verifyToken.js';

const router : Router = express.Router();

// Query params : ?search=value  Currently works on names
router.get('/search', verifyToken, userController.search_user);

router.get('/organization/:orgId',verifyToken, userController.find_all_by_org)

router.get('/:userId',verifyToken, userController.get_user);

router.get("/:userId/classes",verifyToken, userController.get_user_classes);

router.post('/create', userController.create_account);

router.put(`/edit/:userId`,verifyToken, userController.edit_user_info);

router.put(`/:userId/email/edit`,verifyToken, userController.edit_email);

router.put(`/:userId/password/edit`,verifyToken, userController.edit_password);

router.put('/:userId/verify', userController.verify_user);

router.delete(`/:userId/delete`,verifyToken, userController.delete_user);

export default router
