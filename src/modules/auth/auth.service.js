import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import userRepository from '../user/user.repository.js';
import { hashPassword, comparePassword } from '../../utils/bcrypt.js';
dotenv.config();

class AuthService {
    async register({ name, email, password }) {
        const existingUser = await userRepository.findByEmail(email);

        if (existingUser) {
            return { status: false, message: 'User with this email already exists' };
        }

        const passwordHash = await hashPassword(password);
        const user = await userRepository.create({ name, email, passwordHash });

        const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { status: true, user, token };
    }

    async login({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            return { status: false, message: 'Invalid credentials' };
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return { status: false, message: 'Invalid credentials' };
        }

        const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { status: true, message: 'Login successful', user, token };
    }
}

export default new AuthService();
