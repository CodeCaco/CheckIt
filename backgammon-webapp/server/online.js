const { v4: uuidv4 } = require('uuid');

var io
var gameSocket
var currentSessions = []
var codedSessions = []
var codesUsed = []

class Game {
    constructor(creator) {
        this.creator = creator
        this.state = {
            dice: [],
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
            toggleFinalTable: false,
            toggleNoMoves: false
        }
    }

    newGameSetup = () => {
        const pips = Array(24).fill({player: null, checkers: 0})

        pips[12] = {player: 1, checkers: 15}
        pips[11] = {player: 2, checkers: 15}

        const boxes = Array(2).fill().map((_, i) => ({player: i + 1, checkers: 15}))

        boxes[0].checkers = 0
        boxes[1].checkers = 0

        const start = Math.random() < 0.5 ? true : false
        console.log(start)

        this.state = {
            dice: [],
            player1: start,
            p1FirstChecker: 12,
            p2FirstChecker: 11,
            moving: false,
            pips: pips,
            p1Path: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
            p2Path: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            boxes: boxes,
            redWP: 50,
            redWPHistory: [],
            toggleFinalTable: false,
            toggleNoMoves: null
        }
    }

    calculateRoll = () => {
        let dice = [];

        // finds 2 random numbers between 1-6 and adds them to dice => simulating roll of 2 dices
        for (let i = 0; i < 2; i++) {
        dice.push(Math.floor(Math.random() * 6) +1)
        }

        // dice = [6, 6]
        // if both die rolls are the same, then double it (FEVGA rule)
        if (dice[0] === dice[1]) {
        for (let i = 0; i < 2; i++) {
            dice.push(dice[0])
        }
        }

        dice.sort((a, b) => b - a)
        let pips = this.cleanPips(this.state.pips)
        let boxes = this.cleanBoxes(this.state.boxes)

        // find the available moves after the roll of the dice
        const firstCheckerIndex = this.state.player1 ? this.state.p1FirstChecker : this.state.p2FirstChecker

        const moves = this.findMoves(pips, dice, firstCheckerIndex, boxes)

        if ("noMoves" in moves) {
            dice = []
            this.state.player1 = !this.state.player1
            this.state.toggleNoMoves = true
        }

        this.state.dice = dice
        this.state.pips = moves.pips
    }

    findMoves = (pips, dice, firstCheckerIndex, boxes) => {
        let pipPath = []
        let playerPips = []

        // for both players specify it's path and which pips have checkers that are allowed to move
        if (this.state.player1) {
            // this array is responsible for the pip path each player follows
            pipPath = this.state.p1Path

            // if the first checker still hasn't moved from starting table, only find the pip of that first checker
            if (firstCheckerIndex !== false) {
                playerPips = pips.filter((p, i) => i === firstCheckerIndex)
            } else {
                // find all the pips that have p1 checkers
                playerPips = pips.filter(pip => pip.player === 1)
            }
        } else {
            // this array is responsible for the pip path each player follows
            pipPath = this.state.p2Path

            // if the first checker still hasn't moved from starting table, only find the pip of that first checker
            if (firstCheckerIndex !== false) {
                playerPips = pips.filter((p, i) => i === firstCheckerIndex)
            } else {
                // find all the pips that have p1 checkers
                playerPips = pips.filter(pip => pip.player === 2)
            }
        }

        let newPips = this.cleanPips(pips)
        let foundMoves = false

        // for each pip find the ones that have movable checkers
        playerPips.forEach((pip) => {
        const originIndex = pips.findIndex(p => p === pip)
        const pathOriginIndex = pipPath.findIndex(p => p === originIndex)

        let numberOfPossibleDestinations = 0
        dice.forEach((die) => {
            // calculate the destination index to get pip from the pipPath
            let destinationIndex = (pathOriginIndex + die) % 24
            let destinationPip = pipPath[destinationIndex]
        
            // check that the destination pip doesn't loop path
            const remainingPath = (pipPath.length - 1) - pathOriginIndex
            if (die <= remainingPath) {
            // check that the destination pip doesn't have enemy player checkers
            if (pips[destinationPip].player === pips[originIndex].player || pips[destinationPip].player === null) {
                numberOfPossibleDestinations++
            }
            }
        })

        // check if checker is in a bearable position
        if(this.handleBearing(pips, pathOriginIndex, dice, pipPath, boxes).canBearOff) {
            numberOfPossibleDestinations++
        }

        // if there are possible destinations then mark that checker has movable
        if (numberOfPossibleDestinations > 0) {
            newPips[originIndex].movable = [originIndex, pipPath, firstCheckerIndex]
            foundMoves = true
        }
        });

        // check if there are not more moves available
        if (!foundMoves) {
            return {pips: newPips, noMoves: true}
        }
        return {pips: newPips}
    }

    // function responsible for performing the necessary steps when a user clicks on an available checker to move
    checkerClick = (originIndex, pipPath, firstCheckerIndex) => {
        let dice = this.state.dice

        // remove all the highlights from the board
        let pips = this.cleanPips(this.state.pips)
        let boxes = this.cleanBoxes(this.state.boxes)
        
        // check if checker was set or unset by player
        const checker = originIndex !== this.state.moving ? originIndex : false

        if (checker !== false) {
        // highlight the checker that's moving
        pips[checker].movable = [checker, pipPath, firstCheckerIndex]
        
        let possibleDestinations = []
        const pathOriginIndex = pipPath.findIndex(pip => pip === originIndex)

        dice.forEach((die) => {
            // calculate the destination index to get pip from the pipPath
            let destinationIndex = (pathOriginIndex + die) % 24
            let receivingPip = pipPath[destinationIndex]

            // check that the destination pip doesn't loop path
            const remainingPath = (pipPath.length - 1) - pathOriginIndex
            if (die <= remainingPath) {
            // check that the destination pip doesn't have enemy player checkers
            if (pips[receivingPip].player === pips[checker].player || pips[receivingPip].player === null) {
                possibleDestinations.push({index: receivingPip, die: die})
            }
            }
        });

        possibleDestinations.forEach((pip) => {
            pips[pip.index].receivable = [pip.index, pip.die]
        })

        // if checker is bearable then highlight checker box as a possible destination
        const bearOffInformation = this.handleBearing(pips, pathOriginIndex, dice, pipPath, boxes)
        if (bearOffInformation.canBearOff) {
            const player = this.state.player1 ? 0 : 1
            boxes[player].receivable = [null, bearOffInformation.bearableDie]
        }

        } else {
            // if checker is unset then find and highlight all the checkers available to move again
            const moves = this.findMoves(pips, this.state.dice, firstCheckerIndex, boxes);
            pips = moves.pips;
        }
        
        this.state.pips = pips
        this.state.moving = checker
        this.state.boxes = boxes
    }

    // function responsible for performing the necessary steps when a user clicks on a destination pip to move a checker to it
    receiverClick = (index, die) => {
        let firstCheckerIndex = false

        // update the state of the first checker depending on whether or not it crossed to the opposing table
        if (this.state.player1) {
            firstCheckerIndex = this.state.p1FirstChecker
            if (firstCheckerIndex !== false) {
                if (index < 24 && index > 11) {
                    firstCheckerIndex = index
                } else {
                    firstCheckerIndex = false
                }
            }
        } else {
            firstCheckerIndex = this.state.p2FirstChecker
            if (firstCheckerIndex !== false) {
                if (index < 12) {
                    firstCheckerIndex = index
                } else {
                    firstCheckerIndex = false
                }
            }
        }
        let pips = this.cleanPips(this.state.pips)
        let boxes = this.cleanBoxes(this.state.boxes)

        let moving = this.state.moving

        // remove checker from the origin pip
        pips[moving].checkers--

        // if the origin pip is empty after removal, make it non player occupied
        if (pips[moving].checkers === 0) {
            pips[moving].player = null
        }
        
        // update moving checker to null to notify that no checker is moving 
        moving = null

        let player = this.state.player1 ? 1 : 2

        // if index is null, then checker is bearing off thus adding incrementing the checkers in checker box
        if (index === null) {
            boxes[player - 1].checkers++

            // check if game has ended by having 15 checkers in the checker box
            if (boxes[player - 1].checkers === 15) {
                this.state.toggleFinalTable = true
                this.state.winner = this.state.player1
            }
        } else {
            // add a checker to the destination pip & update the pip's player occupation to that of the checker owner
            pips[index].checkers++
            pips[index].player = player
        }
        // after move is done, remove the die responsible for said move
        let dice = this.state.dice
        const dieIndex = dice.findIndex(d => d === die)
        dice.splice(dieIndex, 1)

         // check if player still has moves left to perform, if not switch players

        if (dice.length !== 0) {
            const moves = this.findMoves(pips, dice, firstCheckerIndex, boxes);
            pips = moves.pips;
            player = this.state.player1

            if ("noMoves" in moves) {
                dice = []
                player = !this.state.player1
                this.state.toggleNoMoves = true
            }
        } else {
            player = !this.state.player1
        }


        const redWP = this.calculateRedWP(pips)
        this.state.redWPHistory.push(redWP)

        if (this.state.player1) {
            this.state.p1FirstChecker = firstCheckerIndex
        } else {
            this.state.p2FirstChecker = firstCheckerIndex
        }

        this.state.dice = dice
        this.state.pips = pips
        this.state.player1 = player
        this.state.moving = moving
        this.state.boxes = boxes
        this.state.redWP = redWP
    }
    
    // function that iterates through the last table and sees if user has all the checkers in it meaning it can start bearing off pieces
    checkBearingPosition = (pips, boxes) => {
        const player = this.state.player1 ? 1 : 2
        let bearablePips = []
        if (player === 1) {
        bearablePips = [5, 4, 3, 2, 1, 0]
        } else {
        bearablePips = [18, 19, 20, 21, 22, 23]
        }

        const playerPips = bearablePips.filter(pip => pips[pip].player === player)
        let sum = 0
        playerPips.forEach((pip) => {
        sum += pips[pip].checkers
        })
        
        if (sum === (15 - boxes[player - 1].checkers)) {
        return true
        } else {
        return false
        }
    }

    // function that checks if checker is allowed to bear off or not
    handleBearing = (pips, pipPathIndex, dice, pipPath, boxes) => {
        let canBearOff = false
        let bearableDie = null

        // check if the board position allows for bearing off
        if (!this.checkBearingPosition(pips, boxes)) {
        canBearOff = false
        } else {
        // check if die roll is exact to bear off
        dice.forEach((die) => {
            const exactBearOff = (pipPathIndex + die) === 24 ? true : false
            if (exactBearOff) {
            canBearOff = true
            bearableDie = die
            }
        })

        // if there is not exact bear off we need to check if there are checkers that could utilise a portion of die to bear off
        if (!canBearOff) {
        
            // calculate if die is more than the remaining path of checker
            const moreBearOff = (pipPathIndex + dice[0]) > 24 ? true : false

            // if it is, we need to check if there are checkers behind that have priority move
            if (moreBearOff) {
            let highestPipChecker = true
        
            // loop through each pip behind and check if it has a checker by checking if the current pip is the highest pip checker
            for (let i = pipPathIndex-1; i >= pipPath.length - 6; i--) {
                const player = this.state.player1 ? 1 : 2
                const backwardIndex = pipPath[i]

                // if it encounters a pip with checkers that belong to the user wishing to bear off, then that means that the checker is not the highest pip checker
                if (pips[backwardIndex].checkers > 0 && pips[backwardIndex].player === player ) {
                highestPipChecker = false
                }
            }

            // if no pip has checkers that belong to user, then checker is allowed to bear off
            if (highestPipChecker) {
                canBearOff = true
                bearableDie = dice[0]
            }
            }
        }
        }
        return {canBearOff: canBearOff, bearableDie: bearableDie}
    }

    calculateRPC = (pips) => {
        let playerRPCS = Array(2).fill().map((_, i) => ({player: i + 1, rpc: 0}))

        playerRPCS.forEach((player, i) => {
        const pipPath = player.player === 1 ? this.state.p1Path : this.state.p2Path
        const playerPips = pips.filter(pip => pip.player === player.player)
        playerPips.forEach((pip) => {
            const originIndex = pips.findIndex(p => p === pip)
            const pathOriginIndex = pipPath.findIndex(p => p === originIndex)
            const remainingPath = (pipPath.length) - pathOriginIndex
            playerRPCS[i].rpc += remainingPath * pip.checkers
        })
        })
        return playerRPCS
    }

    getClosestValue = (a) => {
        if (a === 0) {
        return 0.5
        }
        const probabilityTable = {
        0: 0.5,
        0.00137882: 0.51,
        0.00551875: 0.52,
        0.0124302: 0.53,
        0.0221307: 0.54,
        0.0346450: 0.55,
        0.0500050: 0.56,
        0.0682506: 0.57,
        0.0894296: 0.58,
        0.113598: 0.59,
        0.140821: 0.6,
        0.171174: 0.61,
        0.204741: 0.62,
        0.241618: 0.63,
        0.281913: 0.64,
        0.325747: 0.65,
        0.373256: 0.66,
        0.424591: 0.67,
        0.479920: 0.68,
        0.539433: 0.69,
        0.603341: 0.7,
        0.671879: 0.71,
        0.745311: 0.72,
        0.823934: 0.73,
        0.908082: 0.74,
        0.998131: 0.75,
        1.09451: 0.76,
        1.19769: 0.77,
        1.30824: 0.78,
        1.42679: 0.79,
        1.55407: 0.8,
        1.69092: 0.81,
        1.83834: 0.82,
        1.99749: 0.83,
        2.16975: 0.84,
        2.35678: 0.85,
        2.56060: 0.86,
        2.78365: 0.87,
        3.02902: 0.88,
        3.30059: 0.89,
        3.60337: 0.9,
        3.94399: 0.91,
        4.33145: 0.92,
        4.77844: 0.93,
        5.30360: 0.94,
        5.93596: 0.95,
        6.72439: 0.96,
        7.76102: 0.97,
        9.25404: 0.98,
        11.8737: 0.99
        }
        const keys = Object.keys(probabilityTable).map((string) => (parseFloat(string)));
        let left = 0;
        let right = keys.length - 1;
        while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (keys[mid] < a) {
            left = mid + 1;
        } else {
            right = mid;
        }
        }
        const closestKey = keys[right-1];
        return probabilityTable[closestKey];
    }

    calculateRedWP = (pips) => {
        const playerRPCS = this.calculateRPC(pips)
        let x, y = 0
        if (this.state.player1) {
        x = playerRPCS[0].rpc
        y = playerRPCS[1].rpc
        } else {
        x = playerRPCS[1].rpc
        y = playerRPCS[0].rpc
        }

        const delta = y - (x - 4)
        const s = x + y
        const numerator = Math.pow(delta, 2) + (delta / 7)
        const denominator = s - 24.7
        let PI = numerator / denominator
        if (PI < 0) {
        PI = PI * -1
        }
        let probability = this.getClosestValue(PI)
        if (x > y && probability > 0.5) {
        probability = 1 - probability
        }
        if (!this.state.player1) {
        probability = 1 - probability
        }

        return probability * 100
    }

    // function responsible to give a new pip array without movable or receivable functions
    cleanPips = (pips) => {
        let newPips = pips.map((pip) => {
            return {player: pip.player, checkers: pip.checkers}
        })
        return newPips
    }

    cleanBoxes = (boxes) => {
        let newBoxes = boxes.map((box, i) => {
            return {player: i + 1, checkers: box.checkers}
        })
        return newBoxes
    }
}

const gameInit = (sio, ssocket) => {
    io = sio
    gameSocket = ssocket

    gameSocket.on('find-game', findGame)

    gameSocket.on('create-game', createGame)

    gameSocket.on('join-game', joinGame)

    gameSocket.on('start-game', startGame)

    gameSocket.on("player-left-lobby", playerLeftLobby)

    gameSocket.on('disconnect', handleDisconnect) 

    gameSocket.on("dice-click", diceClick)

    gameSocket.on("checker-click", handleCheckerClick)
    
    gameSocket.on("receiver-click", handleReceiverClick)

    gameSocket.on("player-disconnected", handlePlayerDisconnect)
}

/* --------------------------------- */
/*            Game Logic             */
/* --------------------------------- */

async function gameStart(socketID, isRandom) {
    const {game, room} = findGameAndRoom(socketID, isRandom)
    const roomName = "room-" + room.id

    game.newGameSetup()
    await new Promise(resolve => setTimeout(resolve, 100));
    io.to(roomName).emit("update-state", JSON.stringify(game.state))
}

function diceClick(isRandom) {
    const {game, room} = findGameAndRoom(this.id, isRandom)
    if (verifyClicker(game.state.player1, room.creator, this.id)) {
        game.calculateRoll()
        this.emit("calculate-roll", JSON.stringify(game.state))

        if (game.state.toggleNoMoves) {
            this.emit("render-no-moves")
            game.state.toggleNoMoves = false
        }

        const state = cleanState(game)
        this.to(`room-${room.id}`).emit("update-state", JSON.stringify(state))
    }
}

function handleCheckerClick(originIndex, pipPath, firstCheckerIndex, isRandom) {
    const {game, room} = findGameAndRoom(this.id, isRandom)
    if (verifyClicker(game.state.player1, room.creator, this.id)) {
        game.checkerClick(originIndex, pipPath, firstCheckerIndex)
        this.emit("click-update-state", JSON.stringify(game.state))
    }
}

function handleReceiverClick(index, die, isRandom) {
    const {game, room} = findGameAndRoom(this.id, isRandom)
    if (verifyClicker(game.state.player1, room.creator, this.id)) {
        game.receiverClick(index, die)
        this.emit("click-update-state", JSON.stringify(game.state))

        if (game.state.toggleNoMoves) {
            this.emit("render-no-moves")
            game.state.toggleNoMoves = false
        }

        const state = cleanState(game)
        this.to(`room-${room.id}`).emit("update-state", JSON.stringify(state))

        if (game.state.toggleFinalTable) {
            io.to(`room-${room.id}`).emit("render-end-menu", JSON.stringify(game.state.winner))
        }
    }
}
/* --------------------------------- */
/*         Utility Functions         */
/* --------------------------------- */

function playerLeftLobby() {
    const coded  = codedSessions.find(room => room.players.includes(this.id));
    if (coded) {
        this.to(`room-${coded.id}`).emit("opponent-left")
        io.to(`room-${coded.id}`).emit("player-disconnected")
    }
}

function handlePlayerDisconnect() {
    this.emit("player-disconnected")
}

function handleDisconnect() {
    const current = currentSessions.find(room => room.players.includes(this.id));
    const coded  = codedSessions.find(room => room.players.includes(this.id));

    if (current) {
        // remove current room from codedSessions
        const index = currentSessions.indexOf(current);
        if (index !== -1) {
            currentSessions.splice(index, 1);
        }
        this.to(`room-${current.id}`).emit("player-disconnect")
    } else if (coded) {
        // remove coded room from codedSessions
        const index = codedSessions.indexOf(coded);
        if (index !== -1) {
            codedSessions.splice(index, 1);
        }
        this.to(`room-${coded.id}`).emit("player-disconnect")
    }
    this.leaveAll()
}

function cleanState(game) {
    const state = game.state
    state.pips = game.cleanPips(state.pips)
    state.boxes = game.cleanBoxes(state.boxes)
    return state
}

function verifyClicker(player, creator, socketID) {
    return ((player && (creator === socketID)) || (!player && (creator !== socketID)))
}

function findGameAndRoom(socketID, isRandom) {
    let room, game
    if (isRandom === true) {
        room = currentSessions.find(room => room.players.includes(socketID));
        game = currentSessions.find(r => r.id === room.id).game
    } else {
        room = codedSessions.find(room => room.code === isRandom);
        game = codedSessions.find(r => r.id === room.id).game
    }
    return {game: game, room: room}
}

function createRoom(socketID) {
    const room = {
        id: uuidv4(),
        players: [],
        game: new Game(socketID),
        creator: socketID
      };
    currentSessions.push(room);
    return room;
}


function findGame() {
    const room = currentSessions.find(room => room.players.length < 2)

    if (room) {
        room.players.push(this.id)
        this.join(`room-${room.id}`)
        console.log(`Player ${this.id} joined room ${room.id}`);

        io.to(`room-${room.id}`).emit("game-start", room.creator)
        gameStart(this.id, true)
    } else {
        // Create a new room and join it
        const newRoom = createRoom(this.id);
        newRoom.players.push(this.id);
        this.join(`room-${newRoom.id}`);
        console.log(`Player ${this.id} created and joined room ${newRoom.id}`);
    }
}

function createGame() {
    let code = Math.random().toString(36).substring(2, 8).toUpperCase()
    while (codesUsed.includes(code)) {
        code = Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    const room = {
        id: uuidv4(),
        players: [],
        game: new Game(this.id),
        creator: this.id,
        code: code
      };
    
    codedSessions.push(room);
    codesUsed.push(code);
    room.players.push(this.id);
    this.join(`room-${room.id}`);
    console.log(`Player ${this.id} created and joined room ${room.id} with code ${room.code}`);
    this.emit("created-room", room.code)
}

function joinGame(code) {
    const room = codedSessions.find(room => room.players.length < 2 && room.code === code);

    if (room) {
        room.players.push(this.id)
        this.join(`room-${room.id}`)
        console.log(`Player ${this.id} joined room ${room.id}`);

        this.to(`room-${room.id}`).emit("player-joined")
    } else {
        this.emit("no-valid-room")
    }
}

function startGame() {
    const room  = codedSessions.find(room => room.players.includes(this.id));
    io.to(`room-${room.id}`).emit("game-start", room.creator)
    gameStart(this.id, room.code)
}



exports.gameInit = gameInit