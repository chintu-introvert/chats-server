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

            // Join only the latest message per room
            .leftJoin(
                slaveKnex('messages as m1')
                    .select('m1.roomid', 'm1.content', 'm1.created_at', 'm1.userid')
                    .whereRaw(`
                    m1.created_at = (
                    SELECT MAX(m2.created_at)
                    FROM messages m2
                    WHERE m2.roomid = m1.roomid
                    )
                `)
                    .as('lm'),
                'lm.roomid',
                'r.id'
            )

            .where('ur.userid', userId)

            .select(
                'ur.receiverid as id',
                'u.name',
                'u.profile',
                'ur.roomid',
                // Return null when no message exists, otherwise a proper JSON string
                slaveKnex.raw(`
                IF(
                    lm.content IS NULL,
                    NULL,
                    JSON_UNQUOTE(JSON_OBJECT(
                        'content', lm.content,
                        'senderId', lm.userid,
                        'created_at', DATE_FORMAT(lm.created_at, '%Y-%m-%dT%H:%i:%s.000Z')
                    ))
                ) as lastMessage
                `)
            )

            .orderBy('lm.created_at', 'desc');
    }
}

export default new RoomRepository();
