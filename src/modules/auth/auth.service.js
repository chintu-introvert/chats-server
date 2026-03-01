import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import userRepository from '../user/user.repository.js';
import { UnauthorizedError, ValidationError } from '../../domain/exceptions/AppError.js';
import { hashPassword, comparePassword } from '../../utils/bcrypt.js';
dotenv.config();

class AuthService {
    async register({ name, email, password }) {
        const existingUser = await userRepository.findByEmail(email);

        if (existingUser) {
            throw new Error('Email already in use');
        }

        const passwordHash = await hashPassword(password);
        const user = await userRepository.create({ name, email, passwordHash });

        return user;
    }

    async login({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { user, token };
    }
}

export default new AuthService();
