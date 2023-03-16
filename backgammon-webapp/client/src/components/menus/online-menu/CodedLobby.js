import React from 'react'
import './CodedLobby.css'
const socket = require('../../../connection').socket

function CodedLobby(props) {

  const p1 = props.isCreator ? "You" : props.opponent
  const p2 = props.isCreator ? props.opponent : "You"

  const p1CurrentCSS = props.isCreator ? "current-player" : "" 
  const p2CurrentCSS = props.isCreator ? "" : "current-player"

  function handleLeaveLobby() {
    socket.emit("player-left-lobby")
  }

  function handleStartGame() {
    socket.emit("start-game")
  }

  return (
    <div className='coded-background'>
      <button className='coded-leave-lobby' onClick={handleLeaveLobby}></button>
      <div className='coded-central'>
        <div className="coded-header">Lobby</div>
        <div className="coded-code">Code: {props.code}</div>
        <div className={`coded-player p1 ${p1CurrentCSS}`}>
          <div className="coded-image creator"></div>
          <div className="coded-label creator">{p1}</div>
        </div>
        <div className={`coded-player p2 ${p2CurrentCSS}`}>
          <div className="coded-image"></div>
          <div className="coded-label">{props.opponentJoin ? p2 : <>Waiting for player<p className='create-dot'></p><p className='create-dot'></p><p className='create-dot'></p><p className='create-dot'></p></>}</div>
        </div>
        {props.opponentJoin ? props.isCreator ? <div className="coded-start" onClick={handleStartGame}>Start</div> : null : null}
      </div>
    </div>
  )
}

export default CodedLobby