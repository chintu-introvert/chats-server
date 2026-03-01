import { socketAuth } from './middlewares/socketAuth.js';
import chatService from '../modules/message/message.service.js';
import userRepository from '../modules/user/user.repository.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

export const setupSockets = async (io) => {
    // io.use(socketAuth);

    io.on('connection', async (socket) => {
        const userId = socket.user?.id || socket.handshake.query?.userId;
        if (!userId) {
            logger.error(`[Socket] Connection rejected: Missing userId (${socket.id})`);
            return socket.disconnect(true);
        }

        logger.info(`[Socket] User Connected: ${userId} (${socket.id})`);

        // try {
        //     await userRepository.setOnlineStatus(userId, true);
        // } catch (err) {
        //     logger.error('Failed to set online status true', err);
        // }

        // Join personal channel for direct messaging
        socket.join(`user_${userId}`);

        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            logger.info(`[Socket] ${userId} attached to room: ${roomId}`);
        });

        socket.on('send_message', async (payload, ackCallback) => {
            try {
                const { roomId, content } = payload;

                const savedMessage = await chatService.processIncomingMessage(userId, roomId, content);

                io.to(roomId).emit('receive_message', savedMessage);

                if (typeof ackCallback === 'function') ackCallback({ success: true, payload: savedMessage });
            } catch (error) {
                logger.error('Error sending message', error);
                if (typeof ackCallback === 'function') ackCallback({ success: false, error: error.message });
            }
        });

        socket.on('sendMessage', async (payload, ackCallback) => {
            try {
                // Support both spellings from payload
                const receiverId = payload.receiverId || payload.recieverId;
                const { content } = payload;
                const senderId = userId; // secure sender identity

                const savedMessage = await chatService.processPrivateMessage(senderId, receiverId, content);

                // emit to the receiver's personal channel
                io.to(`user_${receiverId}`).emit('message', savedMessage);

                if (typeof ackCallback === 'function') ackCallback({ success: true, payload: savedMessage });
            } catch (error) {
                logger.error('Error sending private message', error);
                if (typeof ackCallback === 'function') ackCallback({ success: false, error: error.message });
            }
        });

        socket.on('disconnect', async () => {
            try {
                await userRepository.setOnlineStatus(userId, false);
                logger.info(`[Socket] User Disconnected: ${userId}`);
            } catch (err) {
                logger.error('Failed to set online status false', err);
            }
        });
    });
};
