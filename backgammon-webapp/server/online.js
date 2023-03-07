const socket = require('socket.io-client/lib/socket');
const { v4: uuidv4 } = require('uuid');

var io
var gameSocket
var currentSessions = []

const state = {
    dice: [1,2,3,4,5,6],
    player1: true,
    p1FirstChecker: 12,
    p2FirstChecker: 11,
    moving: false,
    pips: Array(24).fill({player: null, checkers: 0}),
    p1Path: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
    p2Path: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    boxes: Array(2).fill().map((_, i) => ({player: i + 1, checkers: 15})),
    redWP: 50,
    redWPHistory: [],
    finalTable: null
  }

const gameInit = (sio, ssocket) => {
    console.log("Current Sessions: ", currentSessions)
    io = sio
    gameSocket = ssocket

    gameSocket.on('find-game', findGame)

    gameSocket.on('disconnect', () => {
        var game = currentSessions.indexOf(gameSocket)
        // console.log(game)
        currentSessions.splice(game, 1) 
    })

    gameSocket.on("test", test)
}

function test() {
    const roomId = currentSessions.find(room => room.players.includes(this.id)).id;
    const roomName = "room-" + roomId
    
    io.to(roomName).emit("update-state", state)
}

function createRoom() {
    const room = {
        id: uuidv4(),
        players: []
      };
    currentSessions.push(room);
    return room;
}


function findGame() {
    let room = currentSessions.find(room => room.players.length < 2)

    if (room) {
        room.players.push(this.id)
        this.join(`room-${room.id}`)
        console.log(`Player ${this.id} joined room ${room.id}`);
        io.to(`room-${room.id}`).emit("game-start")
    } else {
        // Create a new room and join it
        const room = createRoom();
        room.players.push(this.id);
        this.join(`room-${room.id}`);
        console.log(`Player ${this.id} created and joined room ${room.id}`);
    }
}



exports.gameInit = gameInit