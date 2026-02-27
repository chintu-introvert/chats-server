import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import userRoutes from './modules/user/user.routes.js';
import masterKnex from './config/knex.js';
import slaveKnex from './config/read_knex.js';
import logger from './utils/logger.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Load UI/Module Routes
app.use('/api/users', userRoutes);

// Health Check Endpoint verifying Master and Slave validity
app.get('/health', async (req, res) => {
    try {
        await masterKnex.raw('SELECT 1 as result');
        await slaveKnex.raw('SELECT 1 as result');
        res.status(200).json({ status: 'ok', databases: { master: 'connected', slave: 'connected' } });
    } catch (error) {
        logger.error('Health check failed', { error });
        res.status(503).json({ status: 'unavailable' });
    }
});

app.use(errorHandler);

export default app;
