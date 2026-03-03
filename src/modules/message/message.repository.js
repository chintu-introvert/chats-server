import masterKnex from '../../config/knex.js';
import slaveKnex from '../../config/read_knex.js';
import { Message } from '../../domain/entities/Message.js';

class MessageRepository {
    async createMessage({ roomId, senderId, content }, trx = masterKnex) {
        await trx('messages')
            .insert({ id: null, roomid: roomId, userid: senderId, content });

        const message = await trx('messages')
            .where({ roomid: roomId })
            .orderBy('id', 'desc')
            .first();

        return new Message(message);
    }

    async getMessagesByRoom(roomId, limit = 50, offset = 0) {
        const records = await slaveKnex('messages')
            .select('messages.*')
            .where({ roomid: roomId })
            .orderBy('id', 'asc');
            // .limit(limit)
            // .offset(offset);

        return records.map(r => new Message(r));
    }
}

export default new MessageRepository();
