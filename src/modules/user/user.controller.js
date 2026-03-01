import userService from './user.service.js';

class UserController {
    async getUsers(req, res, next) {
        try {
            // const page = parseInt(req.query.page, 10) || 1;
            // const limit = parseInt(req.query.limit, 10) || 10;
            const users = await userService.getUsers();
            res.status(200).json({ success: true, data: users });
        } catch (error) {
            next(error);
        }
    }

    async getUser(req, res, next) {
        try {
            const user = await userService.getUser(req.params.id);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();
