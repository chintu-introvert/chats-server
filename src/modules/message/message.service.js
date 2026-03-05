import messageRepo from './message.repository.js';
import roomRepo from '../room/room.repository.js';
import { NotFoundError } from '../../domain/exceptions/AppError.js';
import masterKnex from '../../config/knex.js';

class ChatService {
    async processPrivateMessage(senderId, receiverId, rawContent) {
    const sanitizedContent = rawContent
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const result = { data: null, newRoom: false };

    let room = await roomRepo.findPrivateRoom(senderId, receiverId);

    if (room) {

        // ✅ await here
        result.data = await messageRepo.createMessage({
            roomId: room.roomid,
            senderId,
            content: sanitizedContent
        });

    } else {

        // ✅ await transaction
        result.data = await masterKnex.transaction(async (trx) => {

            const roomId = await roomRepo.createPrivateRoom(
                senderId,
                receiverId,
                trx
            );

            return await messageRepo.createMessage({
                roomId,
                senderId,
                content: sanitizedContent
            }, trx);

        });

        result.newRoom = true;
    }

    return result;
}
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
