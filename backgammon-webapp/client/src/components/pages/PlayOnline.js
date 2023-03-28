import React, {Component} from 'react';
import '../../App.css';
import './Play.css';
import 'chart.css'
import Board from '../board/Board';
import { ProgressBar } from '../board/ProgressBar';
import { EndMenu } from '../menus/end-menu/EndMenu';
import { NoMoves } from '../board/outside/dice/NoMoves';

const socket = require('../../connection').socket

class PlayOnline extends Component {

  constructor(props) {
    super(props)
    this.isRandom = props.isRandom
    this.socket = socket

    if (props.isCreator) {
      this.p1 = "You" 
      this.p2 = props.opponent
    } else {
      this.p1 = props.opponent 
      this.p2 = "You"
    }

    const pips = Array(24).fill({player: null, checkers: 0})

    pips[12] = {player: 1, checkers: 15}
    pips[11] = {player: 2, checkers: 15}

    const boxes = Array(2).fill().map((_, i) => ({player: i + 1, checkers: 15}))

    boxes[0].checkers = 0
    boxes[1].checkers = 0

    this.state = {
      dice: [],
      player1: true,
      p1FirstChecker: 12,
      p2FirstChecker: 11,
      moving: false,
      pips: pips,
      p1Path: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
      p2Path: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      boxes: boxes,
      redWP: 50,
      redWPHistory: [],
      finalTable: null,
      noMoves: null
    }
  }

  componentDidMount() {
    this.socket.on('update-state', state => {
      state = JSON.parse(state)
      this.setState(state)
    })

    this.socket.on('calculate-roll', state => {
      state = JSON.parse(state)
      state.pips.forEach((pip,i) => {
        if ("movable" in pip) {
          const [originIndex, pipPath, firstCheckerIndex] = pip.movable
          state.pips[i].movable = this.checkerClick.bind(this, originIndex, pipPath, firstCheckerIndex)
        }
      })
      this.setState(state)

    })

    this.socket.on('click-update-state', state => {
      state = JSON.parse(state)
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
      state.boxes.forEach((boxes,i) => {
        if ("receivable" in boxes) {
          const [index, die] = boxes.receivable
          state.boxes[i].receivable = this.receiverClick.bind(this, index, die)
        }
      })
      this.setState(state)
    })

    this.socket.on("render-no-moves", this.renderNoMoves)
    this.socket.on("render-end-menu", winner => {
      winner = JSON.parse(winner)
      this.renderEndMenu(winner)
    })

    this.socket.on('player-disconnect', () => {
      if (this.state.finalTable === null) {
        window.alert("Opponent player has disconnected")
        this.socket.emit("player-disconnected")
      }
    })
  

    this.handleDiceButtonClick = () => {
      this.socket.emit("dice-click", this.isRandom)
    };
  
    const rollDie = document.getElementById("rollDie")
    if (rollDie !== null) {
      rollDie.addEventListener('click', this.handleDiceButtonClick)
    }

    window.onpopstate = () => {
      this.socket.disconnect()
    }
  }
  
  componentDidUpdate() {
    const rollDieRemove = document.getElementById("rollDie")
    if (rollDieRemove !== null) {
      rollDieRemove.removeEventListener('click', this.handleDiceButtonClick)
    }

    const rollDieAdd = document.getElementById("rollDie")
    if (rollDieAdd !== null) {
      rollDieAdd.addEventListener('click', this.handleDiceButtonClick)
    }
  }

  checkerClick = (originIndex, pipPath, firstCheckerIndex) => {
    this.socket.emit("checker-click", originIndex, pipPath, firstCheckerIndex, this.isRandom)
  }

  // function responsible for performing the necessary steps when a user clicks on a destination pip to move a checker to it
  receiverClick = (index, die) => {
    this.socket.emit("receiver-click", index, die, this.isRandom)
  }

  renderNoMoves = () => {
    const height = document.getElementsByClassName("progress")[0].clientHeight + document.getElementsByClassName("playground")[0].clientHeight
    const width = window.innerWidth
    this.setState({
      noMoves: <NoMoves onClick={this.toggleNoMoves} height={height} width={width}/>,
    })
  }

  toggleNoMoves = () => {
    this.setState({
      noMoves: null
    })
  }

  renderEndMenu = (winner) => {
    const winnerString = winner ? "Player 1" : "Player 2"
    const height = document.getElementsByClassName("progress")[0].clientHeight + document.getElementsByClassName("playground")[0].clientHeight
    const width = window.innerWidth
    const table = (<EndMenu height={height} winnerString={winnerString} width={width} data={this.state.redWPHistory} onClick={true}/>)

    this.setState({
      finalTable: table
    })
  }

  handleResign = () => {
    window.location.reload()
  }

  render() {
  return (
    <>
        <div className="play-layout">
          {this.state.finalTable}
          {this.state.noMoves}
          <div className="profile1">
            <div className="profile-picture p1"></div>
            <div className="profile-score">{this.p1}</div>
          </div>
          <div className="board-wrapper">
            Random Game
            <div className="progress">
              <ProgressBar redWP={this.state.redWP}></ProgressBar>
            </div>
            <div className="playground">
              <Board state={this.state} player1={this.state.player1} rollDice={this.calculateRoll} dice={this.state.dice}/>
            </div>
          </div>
          <div className="profile2">
            <div className="profile-picture p2"></div>
            <div className="profile-score">{this.p2}</div>
          </div>
          <button className="resign-button" onClick={this.handleResign}></button>
        </div>
      </>
    );
}
}
export default PlayOnline;