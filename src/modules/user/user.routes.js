import express from 'express';
import userController from './user.controller.js';
import { authHandler } from '../../middlewares/authHandler.js';

const router = express.Router();

router.get('/', authHandler, userController.getUsers);
router.get('/:id', authHandler, userController.getUser);

export default router;
