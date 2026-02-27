import masterKnex from '../../config/knex.js';
import slaveKnex from '../../config/read_knex.js';
import { v4 as uuidv4 } from 'uuid';

class RoomRepository {
    async createAsync({ name, type = 'group' }) {
        const id = uuidv4();
        await masterKnex('rooms').insert({ id, name, type });
        return masterKnex('rooms').where({ id }).first();
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
