import React from 'react'
import './OnlineMenu.css'
import '../../App.css';
import cookie from 'cookie';
import { useState } from 'react';
import PlayOnline from '../pages/PlayOnline';

const socket = require('../../connection').socket

function OnlineMenu() {
  const [waitingPlayer, setWaitingPlayer] = useState(true)
  const [submit, setSubmit] = useState(false)
  

  document.cookie = cookie.serialize('io', 'example', {
  path: '/',
  sameSite: 'Strict',
  secure: true,
  });
  
  socket.on("connect", () => {
    console.log("A papaya esta ligada")
  });

  socket.on('game-start', () => {
    console.log("Papaya funciona")
    setWaitingPlayer(false)
  })

  function findGame() {
    socket.emit('find-game')
    setSubmit(true)
  }

  return (
    <>
      {waitingPlayer ? submit ?
      <p>Waiting for Player....</p>
      :
      <div>
        <div>OnlineMenu</div>
        <button onClick={() => {findGame()}}>Join Game</button>
      </div>
      : <PlayOnline />
      }
    </>
  )
}

export default OnlineMenu