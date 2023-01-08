import React, {Component} from 'react';
import '../../App.css';
import Board from '../board/Board';

class Play extends Component {
  state = {
    dice: [],
    player1: true,
    start: true,
    pips: Array(24).fill({player: null, checkers: 0})
  }

  calculateRoll = () => {
    const dice = [];

    for (let i = 0; i < 2; i++) {
      dice.push(Math.floor(Math.random() * 6) +1)
    }
    if (dice[0] === dice[1]) {
      for (let i = 0; i < 2; i++) {
        dice.push(dice[0])
      }
    }

    this.findMoves(dice)
    this.setState({
      dice: dice,
    })
  }

  findMoves = (dice) => {
    var columnCheckers = []
    var triangleColumns = [...document.getElementsByClassName("tri-column")]
    var s1 = triangleColumns.slice(0, 6).reverse()
    var s2 = triangleColumns.slice(12, 18).reverse()
    var s3 = triangleColumns.slice(6, 12)
    var s4 = triangleColumns.slice(18, 24)

    if (this.state.player1) {
      triangleColumns = s3.concat(s4, s2, s1)
      var topCheckers = {}
      triangleColumns.forEach((column, i) => {
        var checkers = [...column.getElementsByClassName("checker-format checker-red")]
        var firstChecker = checkers[checkers.length - 1]
        
        if (firstChecker) {
          topCheckers[i] = firstChecker
        }
      })
    } else {
      columnCheckers = document.getElementsByClassName("checker-format checker-white")
      triangleColumns = s2.concat(s1, s3, s4)
    }

    for (var checkerIndex in topCheckers) {
      var checker = topCheckers[checkerIndex]
      checker.className += " movable"
      checker.parentNode.parentNode.className += " click"
    }

    console.log(this.state.pips)

    this.setState({
      pips: [...this.state.pips]
    })
    // var pieceColumn = columnCheckers[columnCheckers.length - 1].parentNode
    // const pieceTriangle = columnCheckers[columnCheckers.length - 1].parentNode.parentNode.children[0]
    // pieceColumn.className += " click"
    // console.log(triangles)
    // console.log(triangles.indexOf(pieceTriangle))

    // triangles[triangles.indexOf(pieceTriangle) + dice[0]].className += " receivable"
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