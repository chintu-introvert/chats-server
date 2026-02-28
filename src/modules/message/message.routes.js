import express from 'express'
import messageController from './message.controller.js';

const router = express.Router();

router.get('/:roomId', messageController.getMessagesByRoom);

export default router;  