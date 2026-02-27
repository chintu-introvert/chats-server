import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

// Default master connection configuration (Writes)
const knexConfig = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_MASTER_HOST || '127.0.0.1',
        port: process.env.DB_MASTER_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'chat_app',
    },
    pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 30000,
    }
};

const masterKnex = knex(knexConfig);

export default masterKnex;
