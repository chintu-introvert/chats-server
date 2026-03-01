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
            .join('user_rooms as ur2', 'ur1.roomid', 'ur2.roomid')
            .join('rooms', 'rooms.id', 'ur1.roomid')
            .where('ur1.userid', user1Id)
            .where('ur2.userid', user2Id)
            .where('rooms.type', 'private')
            .select('rooms.id')
            .first();
        return result;
    }

    async createPrivateRoom(user1Id, user2Id, trx = masterKnex) {
        const [roomId] = await trx('rooms').insert({
            name: `private_${user1Id}_${user2Id}`,
            type: 'private'
        });

        await trx('user_rooms').insert([
            { userid: user1Id, roomid: roomId },
            { userid: user2Id, roomid: roomId }
        ]);

        return roomId;
    }

    async getUserRooms(userId) {
        return slaveKnex('rooms')
            .join('user_rooms', 'rooms.id', 'user_rooms.roomid')
            .where('user_rooms.userid', userId)
            .select('rooms.*');
    }
}

export default new RoomRepository();
