import express from 'express'
import roomController from './room.controller.js';

const router = express.Router();

router.post('/', roomController.createRoom);
router.get('/', roomController.listRooms);
router.get('/:id', roomController.getRoom);

export default router;