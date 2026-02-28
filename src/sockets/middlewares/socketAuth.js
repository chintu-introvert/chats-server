import jwt from 'jsonwebtoken';


export const socketAuth = (socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];

    if (!token) return next(new Error('Authentication error: Token missing'));

    try {
        const extractedToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET || 'your_super_secret_jwt_key');

        // Bind valid user data strictly 
        socket.user = decoded;
        next();
    } catch (err) {
        next(new Error('Authentication error: Invalid or expired token'));
    }
};
