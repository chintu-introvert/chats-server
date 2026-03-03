import dotenv from 'dotenv';
dotenv.config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_MASTER_HOST || '127.0.0.1',
      port: process.env.DB_MASTER_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '1234567890',
      database: process.env.DB_NAME || 'chats'
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_MASTER_HOST,
      port: process.env.DB_MASTER_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  }
};
