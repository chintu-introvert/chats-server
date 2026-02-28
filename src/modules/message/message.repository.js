import masterKnex from '../../config/knex.js';
import slaveKnex from '../../config/read_knex.js';
import { Message } from '../../domain/entities/Message.js';
import { v4 as uuidv4 } from 'uuid';

class MessageRepository {
    async createMessage({ roomId, senderId, content }) {
        const id = uuidv4();
        await masterKnex('messages')
            .insert({ id, room_id: roomId, sender_id: senderId, content });

        const message = await masterKnex('messages').where({ id }).first();
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
