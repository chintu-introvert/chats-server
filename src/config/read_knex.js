import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

// Read replica connection configuration (Reads)
const readKnexConfig = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_SLAVE_HOST || '127.0.0.1',
        port: process.env.DB_SLAVE_PORT || 3307, // Example replica port
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'chat_app',
    },
    pool: {
        min: 2,
        max: 20, // Typically reads outnumber writes, allow larger pool
        acquireTimeoutMillis: 30000,
    }
};

const slaveKnex = knex(readKnexConfig);

export default slaveKnex;
