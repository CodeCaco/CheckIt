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
  const [create, setCreate] = useState(false)
  const [code, setCode] = useState("000000")
  const [isRandom, setIsRandom] = useState(true) 
  

  document.cookie = cookie.serialize('io', 'example', {
  path: '/',
  sameSite: 'Strict',
  secure: true,
  });
  
  socket.on("connect", () => {
    socket.emit("connection")
  });

  socket.on('game-start', () => {
    setWaitingPlayer(false)
  })

  socket.on('created-room', code => {
    setIsRandom(code)
    setCode(code)
  })

  socket.off('no-valid-room').on('no-valid-room', () => {
    setSubmit(false)
    window.alert('Please enter a valid 6-character alphanumeric room code.');
  })

  socket.on('player-disconnected', () => {
    window.location.reload()
  })

  function findGame() {
    socket.emit('find-game')
    setIsRandom(true)
    setSubmit(true)
  }

  function createGame() {
    socket.emit('create-game')
    setCreate(true)
    setIsRandom(false)
    setSubmit(true)
  }

  const handleInputChange = (event) => {
    const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6);
    setCode(value);
  };

  function joinGame() {
    if (code.length === 0 || code.length !== 6) {
      window.alert('Please enter a 6-character alphanumeric code.');
    } else {
      socket.emit('join-game', code)
      setIsRandom(code)
      setSubmit(true)
    }
  };

  return (
    <>
      {waitingPlayer ? submit ? create ? <p>Code: {code}</p> 
      :
      <p>Waiting for Player....</p>
      :
      <div>
        <div>OnlineMenu</div>
        <button onClick={() => {findGame()}}>Play Random</button>
        <button onClick={() => {createGame()}}>Create Game</button>
        <button onClick={() => {joinGame()}}>Join Game</button>
        <input type="text" value={code} onChange={handleInputChange} />
        {/* Gotta add text input to be the thingy */}
      </div>
      : <PlayOnline isRandom={isRandom}/>
      }
    </>
  )
}

export default OnlineMenu