import { v4 as uuidv4 } from 'uuid';
import masterKnex from '../../config/knex.js';
import slaveKnex from '../../config/read_knex.js';
import logger from '../../utils/logger.js';

class UserRepository {
    /**
     * Helper to execute queries with exponential backoff for transient errors
     * (e.g., deadlocks or connection drops).
     */
    async withRetry(operation, retries = 3, delay = 100) {
        try {
            return await operation();
        } catch (error) {
            if (retries > 0 && this.isTransientError(error)) {
                logger.warn(`Database transient error. Retrying in ${delay}ms... (${retries} retries left)`);
                await new Promise((res) => setTimeout(res, delay));
                return this.withRetry(operation, retries - 1, delay * 2);
            }
            throw error;
        }
    }

    isTransientError(error) {
        const code = error.code || '';
        // Deadlock or lost connection codes in MySQL
        return code === 'ER_LOCK_DEADLOCK' || code === 'ECONNRESET' || code === 'PROTOCOL_CONNECTION_LOST';
    }

    // Uses Master Knex instance for writes, wrapped in a transaction
    async create(userData) {
        const id = uuidv4();

        // Example of wrapping the insert within a transaction using the Master instance
        const result = await masterKnex.transaction(async (trx) => {
            await trx('users').insert({
                id,
                username: userData.username,
                email: userData.email,
                password_hash: userData.passwordHash
            });
            // Retrieve the newly created user (still inside transaction using master)
            return trx('users').where({ id }).first();
        });

        return result;
    }

    // Uses Slave Knex instance for reads, paired with automatic retries
    async findById(id) {
        return this.withRetry(() => {
            // Intentionally hitting the read replica
            return slaveKnex('users').where({ id }).first();
        });
    }

    // Additional Read query hitting the slave
    async findAll(limit = 10, offset = 0) {
        return this.withRetry(() => {
            return slaveKnex('users')
                .select('id', 'username', 'email', 'is_online', 'created_at')
                .limit(limit)
                .offset(offset);
        });
    }
}

export default new UserRepository();
