import React, {Component} from 'react';
import '../../App.css';
import './Play.css';
import 'chart.css'
import Board from '../board/Board';
import { ProgressBar } from '../board/ProgressBar';
import { EndMenu } from '../menus/end-menu/EndMenu';

class PlayOnline extends Component {

  constructor(props) {
    super(props)
    this.socket = require('../../connection').socket

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
      finalTable: null
    }
  }

  componentDidMount() {
    this.socket.on('update-state', state => {
      this.setState(state)
    })

    this.socket.on('calculate-roll', state => {
      state.pips.forEach((pip,i) => {
        if ("movable" in pip) {
          const [originIndex, pipPath, firstCheckerIndex] = pip.movable
          state.pips[i].movable = this.checkerClick.bind(this, originIndex, pipPath, firstCheckerIndex)
        }
      })
      this.setState(state)
    })

    this.socket.on('click-update-state', state => {
      state.pips.forEach((pip,i) => {
        if ("movable" in pip) {
          const [originIndex, pipPath, firstCheckerIndex] = pip.movable
          state.pips[i].movable = this.checkerClick.bind(this, originIndex, pipPath, firstCheckerIndex)
        }
        if ("receivable" in pip) {
          const [index, die] = pip.receivable
          state.pips[i].receivable = this.receiverClick.bind(this, index, die)
        }
      })
      state.boxes.forEach((pip,i) => {
        if ("receivable" in pip) {
          const [index, die] = pip.receivable
          state.pips[i].receivable = this.receiverClick.bind(this, index, die)
        }
      })
      this.setState(state)
      console.log(state)
    })

    const rollDie = document.getElementById("rollDie")
    if (rollDie !== null) {
      rollDie.addEventListener('click', () => {
        this.socket.emit("dice-click")
      })
    }
  }
  
  componentDidUpdate() {
    const rollDieRemove = document.getElementById("rollDie")
    if (rollDieRemove !== null) {
      rollDieRemove.removeEventListener('click', () => {
        this.socket.emit("dice-click")
      })
    }
  
    const rollDieAdd = document.getElementById("rollDie")
    if (rollDieAdd !== null) {
      rollDieAdd.addEventListener('click', () => {
        this.socket.emit("dice-click")
      })
    }
  }

  checkerClick = (originIndex, pipPath, firstCheckerIndex) => {
    this.socket.emit("checker-click", originIndex, pipPath, firstCheckerIndex)
  }

  // function responsible for performing the necessary steps when a user clicks on a destination pip to move a checker to it
  receiverClick = (index, die) => {
    this.socket.emit("receiver-click", index, die)
  }

  test = () => {
    console.log(this.state.pips)
  }

  render() {
  return (
      <>
        <div className="progress">
          <ProgressBar redWP={this.state.redWP}></ProgressBar>
        </div>
        <div className="playground">
          {this.state.finalTable}
          <Board state={this.state} player1={this.state.player1} rollDice={this.calculateRoll} dice={this.state.dice}/>
        </div>
        <button onClick={this.test}>clear</button>
        {/* <button onClick={this.newGameSetup}>start</button>
        <button onClick={() => this.renderEndMenu(this.state.player1)}>test</button> */}
      </>
    );
}
}
export default PlayOnline;