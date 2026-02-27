import app from './app.js';
import logger from './utils/logger.js';
import masterKnex from './config/knex.js';
import slaveKnex from './config/read_knex.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    logger.info(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Implement Graceful Shutdown
const gracefulShutdown = async (signal) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    // 1. Stop accepting new requests
    server.close(async (err) => {
        if (err) {
            logger.error('Error during HTTP server closure', err);
            process.exit(1);
        }

        logger.info('HTTP server closed, closing database connections...');

        try {
            // 2. Tear down Master and Slave Database pools securely
            await masterKnex.destroy();
            logger.info('Master database connection pool closed.');

            await slaveKnex.destroy();
            logger.info('Slave database connection pool closed.');

            logger.info('Graceful shutdown completed successfully.');
            process.exit(0);
        } catch (dbError) {
            logger.error('Error closing database connections', dbError);
            process.exit(1);
        }
    });

    // Failsafe exit if hanging for > 15 seconds
    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 15000);
};

// Catch termination signals attached by PM2/Docker
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Catch Unhandled exceptions to prevent zombie processes
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception thrown', err);
    gracefulShutdown('uncaughtException');
});
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at Promise', { reason, promise });
    gracefulShutdown('unhandledRejection');
});
