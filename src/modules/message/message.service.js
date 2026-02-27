import messageRepo from './message.repository.js';
import roomRepo from '../room/room.repository.js';
import { NotFoundError } from '../../domain/exceptions/AppError.js';

class ChatService {
    async processIncomingMessage(userId, roomId, rawContent) {
        // Basic XSS prevention 
        const sanitizedContent = rawContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Verify room exists (optional strict check)
        const room = await roomRepo.findById(roomId);
        if (!room) {
            throw new NotFoundError('Room not found');
        }

        const message = await messageRepo.createMessage({
            roomId,
            senderId: userId,
            content: sanitizedContent
        });

        return message;
    }

    async getRoomHistory(roomId, limit, offset) {
        return messageRepo.getMessagesByRoom(roomId, limit, offset);
    }
}

export default new ChatService();
