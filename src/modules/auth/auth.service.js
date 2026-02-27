import jwt from 'jsonwebtoken';
import userRepository from '../user/user.repository.js';
import { UnauthorizedError, ValidationError } from '../../domain/exceptions/AppError.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

class AuthService {
    // Simple hashing abstraction - in production use bcrypt/argon2
    _hashPassword(password) {
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    async register({ username, email, password }) {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new ValidationError('Email already in use');
        }

        const passwordHash = this._hashPassword(password);
        const user = await userRepository.create({ username, email, passwordHash });

        // We don't expose password hash back to the controller
        const { passwordHash: _, ...safeUser } = user;
        return safeUser;
    }

    async login({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const passwordHash = this._hashPassword(password);
        if (user.passwordHash !== passwordHash) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'your_super_secret_jwt_key',
            { expiresIn: '24h' }
        );

        const { passwordHash: _, ...safeUser } = user;
        return { user: safeUser, token };
    }
}

export default new AuthService();
