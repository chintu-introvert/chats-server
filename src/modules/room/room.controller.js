import roomService from './room.service.js';

class RoomController {
    async createRoom(req, res, next) {
        try {
            const { name, type } = req.body;
            const result = await roomService.createRoom(name, type);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async listRooms(req, res, next) {
        try {
            const userId = req.user?.id; // Assuming auth middleware sets req.user
            if (!userId) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const rooms = await roomService.getUserRooms(userId);
            res.status(200).json(rooms);
        } catch (error) {
            next(error);
        }
    }

    async getRoom(req, res, next) {
        try {
            const { id } = req.params;
            const room = await roomService.getRoomDetails(id);
            res.status(200).json(room);
        } catch (error) {
            next(error);
        }
    }

    async listLatestRooms(req, res, next) {
        try {
            console.log('latest...')
            const userId = req.user?.id; // Assuming auth middleware sets req.user
            if (!userId) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const rooms = await roomService.getLatestUserRooms(userId);
            console.log(rooms);
            const result = {success: true, data: rooms}
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new RoomController();
