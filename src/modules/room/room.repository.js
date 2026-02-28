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
        await masterKnex('user_rooms').insert({ user_id: userId, room_id: roomId });
    }

    async getUserRooms(userId) {
        return slaveKnex('rooms')
            .join('user_rooms', 'rooms.id', 'user_rooms.room_id')
            .where('user_rooms.user_id', userId)
            .select('rooms.*');
    }
}

export default new RoomRepository();
