import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
    logger.error(err.message, { stack: err.stack, path: req.path, method: req.method });

    const statusCode = err.statusCode || 500;

    if (statusCode === 500 && process.env.NODE_ENV === 'production') {
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }

    return res.status(statusCode).json({
        success: false,
        error: err.message
    });
};
