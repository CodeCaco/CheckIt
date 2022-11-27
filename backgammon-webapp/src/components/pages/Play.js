import React, {Component} from 'react';
import '../../App.css';
import Board from '../board/Board';

class Play extends Component {
  state = {
    dice: [],
    player1: true,
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

    this.setState({
      dice: dice,
    })
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
          <Board player1={this.state.player1} rollDice={this.calculateRoll} dice={this.state.dice} clear={this.clearDice}/>
        </div>
      </>
    );
}
}
export default Play