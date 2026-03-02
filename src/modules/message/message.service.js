import messageRepo from './message.repository.js';
import roomRepo from '../room/room.repository.js';
import { NotFoundError } from '../../domain/exceptions/AppError.js';
import masterKnex from '../../config/knex.js';

class ChatService {
    async processPrivateMessage(senderId, receiverId, rawContent) {
        const sanitizedContent = rawContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        let room = await roomRepo.findPrivateRoom(senderId, receiverId);
        // fetching the room id from the user_rooms table
        //  check if room exists or not  
        if (room) {
            // if it exists just create the message
            return messageRepo.createMessage({
                roomId: room.roomid,
                senderId,
                content: sanitizedContent
            });
        }
        // Room doesn't exist, use transaction to create room and message
        return masterKnex.transaction(async (trx) => {
            const roomId = await roomRepo.createPrivateRoom(senderId, receiverId, trx);
            // once room is created and chat room is also created then insert the message
            return messageRepo.createMessage({
                roomId,
                senderId,
                content: sanitizedContent
            }, trx);
        });
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
