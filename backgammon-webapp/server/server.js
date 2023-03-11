const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const cookie = require('cookie')
const online = require('./online')

const app = express()


const server = http.createServer(app)
const io = socketio(server)

// run when client connects
io.on('connection', client => {

    online.gameInit(io, client)

    client.on('connection', () => {
        // console.log(`Client connected with id ${client.id}`);
    });
})

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});