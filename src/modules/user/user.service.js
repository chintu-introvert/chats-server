import userRepository from './user.repository.js';

class UserService {
    async createUser(payload) {
        // In production, you would hash the password here (e.g. bcrypt)
        const passwordHash = `hashed_${payload.password}`;

        // The service relies on the repository, completely detached from DB scaling logic
        const user = await userRepository.create({ ...payload, passwordHash });

        const { password_hash, ...safeUser } = user;
        return safeUser;
    }

    async getUser(id) {
        const user = await userRepository.findById(id);
        if (!user) throw new Error('User not found');

        const { password_hash, ...safeUser } = user;
        return safeUser;
    }

    async listUsers(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        return userRepository.findAll(limit, offset);
    }
}

export default new UserService();
