import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import roomRoutes from './modules/room/room.routes.js';
import messageRoutes from './modules/message/message.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// app.use(authHandler); // Global authentication middleware, can be customized per route if needed

// Load UI/Module Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

// Simple Health API
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running successfully' });
});

app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Chat API is up and running' });
});


app.use(errorHandler);

export default app;
