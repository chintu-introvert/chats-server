import chatService from './message.service.js';

class MessageController {
    async getMessagesByRoom(req, res, next) {
        try {
            const { roomId } = req.params;
            const limit = parseInt(req.query.limit, 10) || 50;
            const offset = parseInt(req.query.offset, 10) || 0;

            const messages = await chatService.getRoomHistory(roomId, limit, offset);
            res.status(200).json(messages);
        } catch (error) {
            next(error);
        }
    }
}

export default new MessageController();
