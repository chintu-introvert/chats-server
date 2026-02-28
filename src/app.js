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

// Simple Health API
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running successfully' });
});

app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Chat API is up and running' });
});


app.use(errorHandler);

export default app;
