import React from 'react'
import './Board.css'
import { Triangle } from './Triangle';
import { CheckerBox } from './outside/boxes/CheckerBox'
import { Checkers } from '../pieces/Checkers'
import { RollDice } from './outside/dice/RollDice';
import { Dice } from './outside/dice/Dice';
import { BearedChecker } from './outside/boxes/BearedChecker'

const handleCheckers = (player, number, movable, pip) => {
    const iterations = number;

    const hue = player === 1 ? "checker-red" : "checker-white";
    const checkers = [];

    for(let i = 0; i < iterations; i++) {
        if (i === iterations - 1 && movable) {
            checkers.push(<Checkers key={"checker-" + hue + i + pip} style={{"--start": i + 1}} movable={movable} color={hue}/>)
        } else {
            checkers.push(<Checkers key={"checker-" + hue + i + pip} style={{"--start": i + 1}} color={hue}/>)
        }
    }
    return checkers;
}

const handleBearedChecker = (player, number) => {
  const iterations = number;

  const hue = player === 1 ? "checker-red" : "checker-white"
  const checkers = []

  for(let i = 0; i < iterations; i++) {
      checkers.push(<BearedChecker key={"bearedChecker" + hue + i} color={hue}/>)
    }
  return checkers;
}

const Board = (props) => {
    var leftDice = ""
    var rightDice = ""
    var middleLeftDice = []
    var middleRightDice = []
    if (props.player1) {
        leftDice = <RollDice rollDice={props.rollDice} face={6}/>
        if (props.dice.length !== 0) {
            leftDice = ""
            for (let i = 0; i < props.dice.length; i++) {
                middleLeftDice.push(<Dice key={"die-" + i + "-face-" + props.dice[i]} face={props.dice[i]} />)
            }
        }
    } else {
        rightDice = <RollDice rollDice={props.rollDice} face={6}/>
        if (props.dice.length !== 0) {
            rightDice = ""
            for (let i = 0; i < props.dice.length; i++) {
                middleRightDice.push(<Dice key={"die-" + i + "-face-" + props.dice[i]} face={props.dice[i]} />)
            }
        }
    }

  return (
    <div className="board">
      <CheckerBox box={props.state.boxes[0]} checker={handleBearedChecker(props.state.boxes[0].player, props.state.boxes[0].checkers)} side="left">{leftDice}</CheckerBox>
      <div className="board-left">
        <div className="region-up">
            {[1, 0, 1, 0, 1, 0].map((a, i) => {
                if (a === 1) {
                    return <Triangle key={"board-pip" + i} pip={props.state.pips[i]} orientation='tri--down'>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable, i)}</Triangle>
                } else {
                    return <Triangle key={"board-pip" + i} pip={props.state.pips[i]} color='p2-color' orientation='tri--down'>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable, i)}</Triangle>
                }}
            )}
        </div>
        <div className="region-middle">
              {middleLeftDice}
        </div>
        <div className="region-down">
          {[0, 1, 2, 1, 2, 1].map((a, i) => {
              i += 12
              if (a === 1) {
                return <Triangle key={"board-pip" + i} pip={props.state.pips[i]}>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable, i)}</Triangle>
              } else {
                return <Triangle key={"board-pip" + i} pip={props.state.pips[i]} color='p2-color'>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable, i)}</Triangle>
              }}
          )}
        </div>
      </div>
      <div className="board-right">
        <div className="region-up">
          {[1, 2, 1, 2, 1, 0].map((a, i) => {
            i += 6
            if (a === 1) {
                return <Triangle key={"board-pip" + i} pip={props.state.pips[i]} orientation='tri--down'>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable, i)}</Triangle>
            } else {
                return <Triangle key={"board-pip" + i} pip={props.state.pips[i]} color='p2-color' orientation='tri--down'>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable, i)}</Triangle>
              }}
            )}
        </div>
        <div className="region-middle">
        {middleRightDice}
        </div>
        <div className="region-down">
          {[0, 1, 0, 1, 0, 1].map((a, i) => {
            i += 18
            if (a === 1) {
                return <Triangle key={"board-pip" + i} pip={props.state.pips[i]}>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable, i)}</Triangle>
            } else {
                return <Triangle key={"board-pip" + i} pip={props.state.pips[i]} color='p2-color'>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable, i)}</Triangle>
            }}
          )}
        </div>
      </div>
      <CheckerBox box={props.state.boxes[1]} checker={handleBearedChecker(props.state.boxes[1].player, props.state.boxes[1].checkers)} side="right bottom">{rightDice}</CheckerBox>
    </div>
  )
}

export default Board;