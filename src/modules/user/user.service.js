import userRepository from './user.repository.js';
import bcrypt from 'bcrypt';

class UserService {
    async createUser(payload) {
        const hashedPassword = await bcrypt.hash(payload.password, 10);
        const user = await userRepository.create({ ...payload, passwordHash: hashedPassword });
        const { password, ...safeUser } = user;
        return safeUser;
    }

    async getUsers(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        return userRepository.findAll(limit, offset);
    }

    async getUser(id) {
        const user = await userRepository.findById(id);
        if (!user) throw new Error('User not found');
        const { password, ...safeUser } = user;
        return safeUser;
    }
}

export default new UserService();
