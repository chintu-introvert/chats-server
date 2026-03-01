const io = require('socket.io-client');
const socket = io('http://localhost:3000', { query: { userId: '1' } });
socket.on('connect', () => {
    console.log('Connected!');
    socket.emit('sendMessage', { receiverId: '2', content: 'test message' }, (response) => {
        console.log('Ack:', response);
        socket.disconnect();
        setTimeout(() => process.exit(0), 100);
    });
});
socket.on('connect_error', (e) => console.log('Connect error', e));
