import React, {useEffect} from 'react'
import './Board.css'
import {Triangle} from './Triangle';
import {CheckerBox} from './outside/CheckerBox'
import {Checkers} from '../pieces/Checkers'
import { RollDice } from './outside/dice/RollDice';
import { Dice } from './outside/dice/Dice';

const handleCheckers = (player, number) => {
    const iterations = number;

    const hue = player === 1 ? "checker-red" : "checker-white";
    const checkers = [];

    for(let i = 0; i < iterations; i++) {
        checkers.push(<Checkers color={hue}/>)
    }
    return checkers;
}

const Board = (props) => {
    useEffect(() => {
        const checkerColumn = document.getElementsByClassName("checkers-column");
        for (var i = 0; i < checkerColumn.length; i++) {
            var columnCheckers = checkerColumn[i].getElementsByClassName("checker-format"),
                scrollHeight = checkerColumn[i].scrollHeight,
                divHeight = checkerColumn[i].clientHeight,
                offset = (scrollHeight - divHeight) / (columnCheckers.length - 1);
            if (columnCheckers.length > 4) {
                for (var j = 1; j < columnCheckers.length; j++) {
                    columnCheckers[j].style.transform = "translateY(-" + offset * j + "px)";
                }
            }
        } 
      }, []);

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
            {[1, 0, 1, 0, 1, 0].map(a => {
              if (a === 1) {
                return <Triangle orientation='tri--down'>{handleCheckers(1, 10)}</Triangle>
              } else {
                return <Triangle color='p2-color' orientation='tri--down'>{handleCheckers(2, 3)}</Triangle>
              }}
            )}
        </div>
        <div className="region-middle">
              {middleLeftDice}
        </div>
        <div className="region-down">
          {[0, 1, 0, 1, 0, 1].map(a => {
              if (a === 1) {
                return <Triangle />
              } else {
                return <Triangle color='p2-color'/>
              }}
          )}
        </div>
      </div>
      <div className="board-right">
        <div className="region-up">
          {[1, 0, 1, 0, 1, 0].map(a => {
              if (a === 1) {
                return <Triangle orientation='tri--down'/>
              } else {
                return <Triangle color='p2-color' orientation='tri--down'/>
              }}
            )}
        </div>
        <div className="region-middle">
        {middleRightDice}
        </div>
        <div className="region-down">
          {[0, 1, 0, 1, 0, 1].map(a => {
              if (a === 1) {
                return <Triangle />
              } else {
                return <Triangle color='p2-color'/>
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