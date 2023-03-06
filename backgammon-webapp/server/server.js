const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const app = express()


const server = http.createServer(app)
const io = socketio(server)
// run when client connects

io.on('connection', client => {
    console.log("A papaya esta ligada")
})


server.listen(process.env.PORT || 8000)