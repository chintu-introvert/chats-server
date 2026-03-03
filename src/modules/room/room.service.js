import roomRepo from './room.repository.js';
import { NotFoundError } from '../../domain/exceptions/AppError.js';

class RoomService {
    async createRoom(name, type) {
        return roomRepo.createAsync({ name, type });
    }

    async getRoomDetails(roomId) {
        const room = await roomRepo.findById(roomId);
        if (!room) throw new NotFoundError('Room not found');
        return room;
    }

    async joinRoom(userId, roomId) {
        const room = await roomRepo.findById(roomId);
        if (!room) throw new NotFoundError('Room not found');

        await roomRepo.joinRoom(userId, roomId);
        return { success: true, message: `Joined room ${room.name}` };
    }

    async getUserRooms(userId) {
        return roomRepo.getUserRooms(userId);
    }

    async getLatestUserRooms(userId) {
        return roomRepo.getLatestUserRooms(userId);
    }
}

export default new RoomService();
