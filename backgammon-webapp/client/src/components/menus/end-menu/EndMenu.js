import React from 'react'
import './EndMenu.css'
import { Graph } from './Graph'
import {Link} from 'react-router-dom';
const socket = require('../../../connection').socket

export const EndMenu = (props) => {
  let [p1winner, p2winner] = ["", ""]

  const isP1Winner = props.winnerString === "Player 1" ? true : false

  if (isP1Winner) {
    p1winner = "winner"
  } else {
    p2winner = "winner"
  }

  function handleOnlineConnection() {
    if (props.onClick) {
      socket.disconnect()
    }
  }
  
  return (
    <>
    <div className='menu-shadow'>
      <div className='menu-overlay'>
        <div className="menu-header">Winner: {props.winnerString}</div>
        <div className="menu-pictures">
          <div className={`picture-left ${p1winner}`}></div>
          <div className="picture-middle"></div>
          <div className={`picture-right ${p2winner}`}></div>
        </div>
        <div className="menu-graph">
          Game Review
          <Graph data={props.data}></Graph>
        </div>
        <Link to="/" className="menu-button" onClick={handleOnlineConnection}>
            <button className="btn-main-menu">Main Menu</button>
        </Link> 
      </div>
    </div>
    </>
  )
};