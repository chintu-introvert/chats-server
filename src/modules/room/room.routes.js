import express from 'express'
import roomController from './room.controller.js';
import { authHandler } from '../../middlewares/authHandler.js';


const router = express.Router();

router.post('/', roomController.createRoom);
router.get('/', roomController.listRooms);
router.get('/selected/:id', roomController.getRoom);
router.get('/used',authHandler, roomController.listLatestRooms);

export default router;