import React, {Component} from 'react';
import '../../App.css';
import Board from '../board/Board';

class Play extends Component {
  state = {
    dice: [],
    player1: true,
    p1FirstChecker: 12,
    p2FirstChecker: 11,
    moving: false,
    pips: Array(24).fill({player: null, checkers: 0}),
    boxes: Array(2).fill().map((_, i) => ({player: i + 1, checkers: 15}))
  }

  // function responsible for handling the roll of the dice
  calculateRoll = () => {
    let dice = [];

    // finds 2 random numbers between 1-6 and adds them to dice => simulating roll of 2 dices
    for (let i = 0; i < 2; i++) {
      dice.push(Math.floor(Math.random() * 6) +1)
    }

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

    this.setState({
      dice: dice,
      pips: moves.pips
    })
  }

  // function that handles the highlighting of all checkers that are allows to move
  findMoves = (pips, dice, firstCheckerIndex, boxes) => {
    let pipPath = []
    let playerPips = []

    // for both players specify it's path and which pips have checkers that are allowed to move
    if (this.state.player1) {
      // this array is responsible for the pip path each player follows
      pipPath = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

      // if the first checker still hasn't moved from starting table, only find the pip of that first checker
      if (firstCheckerIndex !== false) {
        playerPips = pips.filter((p, i) => i === firstCheckerIndex)
      } else {
        // find all the pips that have p1 checkers
        playerPips = pips.filter(pip => pip.player === 1)
      }
    } else {
      // this array is responsible for the pip path each player follows
      pipPath = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

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

      if(this.handleBearing(pips, pathOriginIndex, dice, pipPath, boxes).canBearOff) {
        numberOfPossibleDestinations++
      }

      if (numberOfPossibleDestinations > 0) {
        newPips[originIndex].movable = this.checkerClick.bind(this, originIndex, pipPath, firstCheckerIndex)
        foundMoves = true
      }
    });
    if (!foundMoves) {
      console.log("No Moves Available")
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
      pips[checker].movable = this.checkerClick.bind(this, checker, pipPath, firstCheckerIndex)
      
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
        pips[pip.index].receivable = this.receiverClick.bind(this, pip.index, pip.die)
      })

      const bearOffInformation = this.handleBearing(pips, pathOriginIndex, dice, pipPath, boxes)
      if (bearOffInformation.canBearOff) {
        const player = this.state.player1 ? 0 : 1
        boxes[player].receivable = this.receiverClick.bind(this, null, bearOffInformation.bearableDie)
      }

    } else {
      // if checker is unset then find and highlight all the checkers available to move again
      const moves = this.findMoves(pips, this.state.dice, firstCheckerIndex, boxes);
      pips = moves.pips;
    }
    
    this.setState({
      pips: pips,
      moving: checker,
      boxes: boxes
    })
  }

  // function responsible for performing the necessary steps when a user clicks on a destination pip to move a checker to it
  receiverClick = (index, die) => {
    let firstCheckerIndex = false

    // update the state of the first checker depending on whether or not it crossed to the opposing table
    if (this.state.player1) {
      firstCheckerIndex = this.state.p1FirstChecker
      if (firstCheckerIndex !== false) {
        if (index < 18) {
          firstCheckerIndex = index
        } else {
          firstCheckerIndex = false
        }
      }
    } else {
      firstCheckerIndex = this.state.p2FirstChecker
      if (firstCheckerIndex !== false) {
        if (index > 5) {
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

    if (index === null) {
      boxes[player - 1].checkers++
      if (boxes[player - 1].checkers === 15) {
        console.log("Game Ended")
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
    } else {
      player = !this.state.player1
    }

    this.setState({
      dice: dice,
      pips: pips,
      player1: player,
      moving: moving,
      boxes: boxes
    })
    if (this.state.player1) {
      this.setState({
        p1FirstChecker: firstCheckerIndex
      })
    } else {
      this.setState({
        p2FirstChecker: firstCheckerIndex
      })
      }
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

  clearDice = () => {
    console.log("yappie")
    var checkers = [...document.getElementsByClassName("movable")]
    checkers.forEach((checker) => {
      checker.className = checker.className.replace(" movable" , "")
    })

    this.setState({
      dice: [],
      player1: !this.state.player1
    })
  }

  setCheckers = () => {
    const pips = [...this.state.pips]

    pips[12] = {player: 1, checkers: 1}

    pips[0] = {player: 1, checkers: 2}
    pips[1] = {player: 1, checkers: 2}
    pips[2] = {player: 1, checkers: 2}
    pips[3] = {player: 1, checkers: 3}
    pips[4] = {player: 1, checkers: 5}

    pips[11] = {player: 2, checkers: 1}

    pips[23] = {player: 2, checkers: 2}
    pips[22] = {player: 2, checkers: 2}
    pips[21] = {player: 2, checkers: 2}
    pips[20] = {player: 2, checkers: 3}
    pips[19] = {player: 2, checkers: 5}
   


    const boxes = [...this.state.boxes]

    boxes[0].checkers = 0
    boxes[1].checkers = 0  


    this.setState({
      pips: pips,
      boxes: boxes
    })
  }

  render() {
  return (
      <>
        <div className="playground">
          <Board state={this.state} player1={this.state.player1} rollDice={this.calculateRoll} dice={this.state.dice} clear={this.clearDice}/>
        </div>
        <button onClick={this.setCheckers}>start</button>
      </>
    );
}
}
export default Play