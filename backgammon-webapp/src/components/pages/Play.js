import React, {Component} from 'react';
import '../../App.css';
import Board from '../board/Board';

class Play extends Component {
  state = {
    dice: [],
    player1: true,
    start: true,
    moving: false,
    pips: Array(24).fill({player: null, checkers: 0})
  }

  calculateRoll = () => {
    let dice = [];

    for (let i = 0; i < 2; i++) {
      dice.push(Math.floor(Math.random() * 6) +1)
    }
    if (dice[0] === dice[1]) {
      for (let i = 0; i < 2; i++) {
        dice.push(dice[0])
      }
    }
    
    dice.sort((a, b) => b - a)
    let pips = this.cleanPips(this.state.pips)
    const moves = this.findMoves(pips, dice)

    this.setState({
      dice: dice,
      pips: moves.pips
    })
  }

  findMoves = (pips, dice) => {
    let pipPath = []
    let playerPips = []

    // specify the pip path each player follows
    if (this.state.player1) {
      pipPath = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
      playerPips = pips.filter(pip => pip.player === 1)
    } else {
      pipPath = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
      playerPips = pips.filter(pip => pip.player === 2)
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
        newPips[originIndex].movable = this.checkerClick.bind(this, originIndex, pipPath)
      }
    });

    return {pips: newPips}
  }

  checkerClick = (originIndex, pipPath) => {
    let dice = this.state.dice

    // remove all the highlights from the board
    let pips = this.cleanPips(this.state.pips)

    // check if checker was set or unset by player
    const checker = originIndex !== this.state.moving ? originIndex : false
  
    if (checker !== false) {
      // highlight the checker that's moving
      pips[checker].movable = this.checkerClick.bind(this, checker)

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
      const moves = this.findMoves(pips, this.state.dice);
      pips = moves.pips;
    }
    
    this.setState({
      pips: pips,
      moving: checker
    })
  }

  receiverClick = (index, die) => {
    let pips = this.cleanPips(this.state.pips)
    let moving = this.state.moving

    pips[moving].checkers--
    if (pips[moving].checkers === 0) {
      pips[moving].player = null
    }
    moving = null

    pips[index].checkers++
    let player = this.state.player1 ? 1 : 2
    pips[index].player = player

    let dice = this.state.dice
    const dieIndex = dice.findIndex(d => d === die)
    dice.splice(dieIndex, 1)

    if (dice.length !== 0) {
      const moves = this.findMoves(pips, dice);
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
  }

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
      start: false,
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