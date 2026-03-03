import masterKnex from '../../config/knex.js';
import slaveKnex from '../../config/read_knex.js';

class RoomRepository {
    async createAsync({ name, type = 'group' }) {
        await masterKnex('rooms').insert({ name, type });
    }

    async findById(id) {
        return slaveKnex('rooms').where({ id }).first();
    }

    async joinRoom(userId, roomId) {
        await masterKnex('user_rooms').insert({ userid: userId, roomid: roomId });
    }

    async findPrivateRoom(user1Id, user2Id) {
        const result = await slaveKnex('user_rooms as ur1')
            .select('ur1.roomid')
            .where('ur1.userid', user1Id)
            .where('ur1.receiverid', user2Id)
            .first();
        return result;
    }

    // create a private room and insert the user id and receiver id into the user_rooms table
    async createPrivateRoom(user1Id, user2Id, trx = masterKnex) {
        const [roomId] = await trx('rooms').insert({
            id: null,
            type: 'direct'
        });

        await trx('user_rooms').insert([
            { userid: user1Id, roomid: roomId, receiverid: user2Id },
            { userid: user2Id, roomid: roomId, receiverid: user1Id }
        ]);

        return roomId;
    }

    async getUserRooms(userId) {
        return slaveKnex('rooms')
            .join('user_rooms', 'rooms.id', 'user_rooms.roomid')
            .where('user_rooms.userid', userId)
            .select('rooms.*');
    }

    async getLatestUserRooms(userId) {
        return slaveKnex('user_rooms as ur')
            .innerJoin('users as u', 'u.id', 'ur.receiverid')
            .innerJoin('rooms as r', 'r.id', 'ur.roomid')
            .innerJoin('messages as m', 'm.roomid', 'r.id')
            .where('ur.userid', userId)
            .groupBy('r.id')
            .select(
                'r.*',
                'u.*',
                'ur.*',
                'm.content',
                // slaveKnex.raw('COUNT(m.id) as message_count'),
                slaveKnex.raw('MAX(m.created_at) as last_message_at')
            )
            .orderBy('last_message_at', 'desc');
    }
}

export default new RoomRepository();
