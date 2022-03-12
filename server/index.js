const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io')
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    // sprint room events
    socket.on('room', function(room) {
        socket.join(room);
        
        socket.on('fetchMessages', (msg) => {
            socket.to(room).emit('fetchMessages', msg);
        });

        socket.on('fetchUsers', () => {
            io.to(room).emit('fetchUsers');
        });

        socket.on('fetchActions', () => {
            io.to(room).emit('fetchActions');
        });

        socket.on('fetchItens', () => {
            io.to(room).emit('fetchItens');
        });
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});