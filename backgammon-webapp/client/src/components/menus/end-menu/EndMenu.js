import React from 'react'
import './EndMenu.css'
import { Graph } from './Graph'
import {Link} from 'react-router-dom';

export const EndMenu = (props) => {

  function handleOnlineConnection() {
    if (props.onClick) {
      const socket = require('../../../connection').socket
      socket.disconnect()
    }
  }
  
  return (
    <>
       <div className='menu-shadow' style={{"--height": props.height, "--width": props.width}}>
      <div className='menu-overlay'>
        <div className="menu-header">Winner: {props.winnerString}</div>
        <div className="menu-pictures">
          <div className="picture-left"></div>
          <div className="picture-middle"></div>
          <div className="picture-right"></div>
        </div>
        <div className="menu-graph">
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