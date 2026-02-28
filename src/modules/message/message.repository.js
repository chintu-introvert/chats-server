import masterKnex from '../../config/knex.js';
import slaveKnex from '../../config/read_knex.js';
import { Message } from '../../domain/entities/Message.js';

class MessageRepository {
    async createMessage({ roomId, senderId, content }) {
        await masterKnex('messages')
            .insert({ room_id: roomId, sender_id: senderId, content });

        const message = await slaveKnex('messages').where({ room_id: roomId }).first();
        return new Message(message);
    }

    async getMessagesByRoom(roomId, limit = 50, offset = 0) {
        const records = await slaveKnex('messages')
            .where({ room_id: roomId })
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);

        return records.map(r => new Message(r));
    }
}

export default new MessageRepository();
