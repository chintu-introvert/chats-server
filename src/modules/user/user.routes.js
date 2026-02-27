import express from 'express';
import userController from './user.controller.js';

const router = express.Router();

router.post('/', userController.createUser);
router.get('/', userController.listUsers);
router.get('/:id', userController.getUser);

export default router;
