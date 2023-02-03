import React from 'react'
import './Board.css'
import {Triangle} from './Triangle';
import {CheckerBox} from './outside/CheckerBox'
import {Checkers} from '../pieces/Checkers'
import { RollDice } from './outside/dice/RollDice';
import { Dice } from './outside/dice/Dice';

const handleCheckers = (player, number, movable) => {
    const iterations = number;

    const hue = player === 1 ? "checker-red" : "checker-white";
    const checkers = [];

    for(let i = 0; i < iterations; i++) {
        if (i === iterations - 1 && movable) {
            checkers.push(<Checkers style={{"--start": i + 1}} movable={movable} color={hue}/>)
        } else {
            checkers.push(<Checkers style={{"--start": i + 1}} color={hue}/>)
        }
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
                middleLeftDice.push(<Dice face={props.dice[i]} />)
            }
        }
    } else {
        rightDice = <RollDice rollDice={props.rollDice} face={6}/>
        if (props.dice.length !== 0) {
            rightDice = ""
            for (let i = 0; i < props.dice.length; i++) {
                middleRightDice.push(<Dice face={props.dice[i]} />)
            }
        }
    }

  return (
    <div className="board">
      <CheckerBox side="left">{leftDice}</CheckerBox>
      <div className="board-left">
        <div className="region-up">
            {[1, 0, 1, 0, 1, 0].map((a, i) => {
                if (a === 1) {
                    return <Triangle pip={props.state.pips[i]} orientation='tri--down'>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable)}</Triangle>
                } else {
                    return <Triangle pip={props.state.pips[i]} color='p2-color' orientation='tri--down'>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable)}</Triangle>
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
                return <Triangle pip={props.state.pips[i]}>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable)}</Triangle>
              } else {
                return <Triangle pip={props.state.pips[i]} color='p2-color'>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable)}</Triangle>
              }}
          )}
        </div>
      </div>
      <div className="board-right">
        <div className="region-up">
          {[1, 2, 1, 2, 1, 0].map((a, i) => {
            i += 6
            if (a === 1) {
                return <Triangle pip={props.state.pips[i]} orientation='tri--down'>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable)}</Triangle>
            } else {
                return <Triangle pip={props.state.pips[i]} color='p2-color' orientation='tri--down'>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable)}</Triangle>
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
                return <Triangle pip={props.state.pips[i]}>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable)}</Triangle>
            } else {
                return <Triangle pip={props.state.pips[i]} color='p2-color'>{handleCheckers(props.state.pips[i].player, props.state.pips[i].checkers, props.state.pips[i].movable)}</Triangle>
            }}
          )}
        </div>
      </div>
      <CheckerBox side="right">{rightDice}</CheckerBox>
      <button onClick={props.clear}>Clear</button>
    </div>
  )
}

export default Board;