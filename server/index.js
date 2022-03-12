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
    console.log('a user connected!');

    socket.on('room', function(room) {
        console.log('entrando em ' + room + '...');
        socket.join(room);
        
        socket.on('fetchUsers', (msg) => {
            console.log('atualizando usuários...');
            io.to(room).emit('fetchUsers', msg);
        });

        socket.on('fetchActions', (msg) => {
            console.log('atualizando ações...');
            io.to(room).emit('fetchActions', msg);
        });

        socket.on('fetchItens', (msg) => {
            console.log('atualizando itens...');
            io.to(room).emit('fetchItens', msg);
        });
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});