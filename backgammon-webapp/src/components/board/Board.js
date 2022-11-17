import React from 'react'
import './Board.css'
import {Triangle} from './Triangle';
import {CheckerBox} from './CheckerBox'

function Board() {
  return (
    <div className="board">
      <div className="outside-column left">
        <div className="region-up">
          <CheckerBox />
        </div>
      </div>
      <div className="board-left">
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