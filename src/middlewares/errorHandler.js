import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
    logger.error(err.message || 'Unknown error', { stack: err.stack, path: req.path, method: req.method });

    const statusCode = err.statusCode

    return res.json({
        success: false,
        error: err.message || 'Internal Server Error',
        stack: err.stack
    });
};
