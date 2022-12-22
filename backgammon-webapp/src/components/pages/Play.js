import React, {Component} from 'react';
import '../../App.css';
import Board from '../board/Board';

class Play extends Component {
  state = {
    dice: [],
    player1: true,
    start: true,
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
    var triangles = [...document.getElementsByClassName("tri")]
    var s1 = triangles.slice(0, 6).reverse()
    var s2 = triangles.slice(12, 18).reverse()
    var s3 = triangles.slice(6, 12)
    var s4 = triangles.slice(18, 24)

    if (this.state.player1) {
      columnCheckers = [...document.getElementsByClassName("checker-format checker-red")];
      triangles = s3.concat(s4, s2, s1)
    } else {
      columnCheckers = document.getElementsByClassName("checker-format checker-white")
      triangles = s2.concat(s1, s3, s4)
    }

    console.log(columnCheckers)
    // var pieceColumn = columnCheckers[columnCheckers.length - 1].parentNode
    // const pieceTriangle = columnCheckers[columnCheckers.length - 1].parentNode.parentNode.children[0]
    // pieceColumn.className += " click"
    // console.log(triangles)
    // console.log(triangles.indexOf(pieceTriangle))

    // triangles[triangles.indexOf(pieceTriangle) + dice[0]].className += " receivable"
  }

  clearDice = () => {

    this.setState({
      dice: [],
      player1: !this.state.player1
    })
  }
  render() {
  return (
      <>
        <div className="playground">
          <Board state={this.state} player1={this.state.player1} rollDice={this.calculateRoll} dice={this.state.dice} clear={this.clearDice}/>
        </div>
      </>
    );
}
}
export default Play