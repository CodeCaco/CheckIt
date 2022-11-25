import React, {useEffect} from 'react'
import './Board.css'
import {Triangle} from './Triangle';
import {CheckerBox} from './outside/CheckerBox'
import {Checkers} from '../pieces/Checkers'

const handleCheckers = (player, number) => {
    const iterations = number;

    const hue = player === 1 ? "checker-red" : "checker-white";
    const checkers = [];

    for(let i = 0; i < iterations; i++) {
        checkers.push(<Checkers color={hue}/>)
    }
    return checkers;
}


function Board() {
    useEffect(() => {
        const checkerColumn = document.getElementsByClassName("checkers-column");
        for (var i = 0; i < checkerColumn.length; i++) {
            var columnCheckers = checkerColumn[i].getElementsByClassName("checker-format"),
                scrollHeight = checkerColumn[i].scrollHeight,
                divHeight = checkerColumn[i].clientHeight,
                offset = (scrollHeight - divHeight) / (columnCheckers.length - 1);
            for (var j = 1; j < columnCheckers.length; j++) {
                columnCheckers[j].style.transform = "translateY(-" + offset * j + "px)";
            }

        } 
      }, []);

  return (
    <div className="board">
      <div className="outside-column left">
        <div className="region-up">
          <CheckerBox placement="box-up"/>
        </div>
      </div>
      <div className="board-left">
        <div className="region-up">
            {[1, 0, 1, 0, 1, 0].map(a => {
              if (a === 1) {
                return <Triangle orientation='tri--down'>{handleCheckers(1, 7)}</Triangle>
              } else {
                return <Triangle color='p2-color' orientation='tri--down'>{handleCheckers(2, 3)}</Triangle>
              }}
            )}
        </div>
        <div className="region-middle">middle</div>
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
        <div className="region-middle">middle</div>
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
      <div className="outside-column right">
        <div className="region-down">
          <CheckerBox placement='box-down' />
        </div>
      </div>
    </div>
  )
}

export default Board;