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
    pips: Array(24).fill({player: null, checkers: 0})
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

    // find the available moves after the roll of the dice
    const firstCheckerIndex = this.state.player1 ? this.state.p1FirstChecker : this.state.p2FirstChecker
    const moves = this.findMoves(pips, dice, firstCheckerIndex)

    this.setState({
      dice: dice,
      pips: moves.pips
    })
  }

  // function that handles the highlighting of all checkers that are allows to move
  findMoves = (pips, dice, firstCheckerIndex) => {
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

      if (numberOfPossibleDestinations > 0) {
        newPips[originIndex].movable = this.checkerClick.bind(this, originIndex, pipPath, firstCheckerIndex)
      }
    });

    return {pips: newPips}
  }

  // function responsible for performing the necessary steps when a user clicks on an available checker to move
  checkerClick = (originIndex, pipPath, firstCheckerIndex) => {
    let dice = this.state.dice

    // remove all the highlights from the board
    let pips = this.cleanPips(this.state.pips)

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
    } else {
      // if checker is unset then find and highlight all the checkers available to move again
      const moves = this.findMoves(pips, this.state.dice, firstCheckerIndex);
      pips = moves.pips;
    }
    
    this.setState({
      pips: pips,
      moving: checker
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
    let moving = this.state.moving

    // remove checker from the origin pip
    pips[moving].checkers--

    // if the origin pip is empty after removal, make it non player occupied
    if (pips[moving].checkers === 0) {
      pips[moving].player = null
    }
    
    // update moving checker to null to notify that no checker is moving 
    moving = null

    // add a checker to the destination pip & update the pip's player occupation to that of the checker owner
    pips[index].checkers++
    let player = this.state.player1 ? 1 : 2
    pips[index].player = player

    // after move is done, remove the die responsible for said move
    let dice = this.state.dice
    const dieIndex = dice.findIndex(d => d === die)
    dice.splice(dieIndex, 1)

    // check if player still has moves left to perform, if not switch players
    if (dice.length !== 0) {
      const moves = this.findMoves(pips, dice, firstCheckerIndex);
      pips = moves.pips;
      player = this.state.player1
    } else {
      player = !this.state.player1
    }

    this.setState({
      dice: dice,
      pips: pips,
      player1: player,
      moving: moving
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

  // function responsible to give a new pip array without movable or receivable functions
  cleanPips = (pips) => {
    let newPips = pips.map((pip) => {
      return {player: pip.player, checkers: pip.checkers}
    })
    return newPips
  }

  clearDice = () => {
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
    pips[12] = {player: 1, checkers: 10}
    pips[11] = {player: 2, checkers: 10}

    this.setState({
      pips: pips
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