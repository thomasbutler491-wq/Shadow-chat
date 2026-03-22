const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let messages = [];

io.on('connection', (socket) => {
    socket.emit('init', messages);

    socket.on('message', (data) => {
        const newMessage = {
            user: data.user || 'Anonymous',
            text: data.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        messages.push(newMessage);
        if (messages.length > 50) messages.shift();
        io.emit('message', newMessage);
    });

    socket.on('burn-all', () => {
        messages = [];
        io.emit('cleared');
    });
});

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
