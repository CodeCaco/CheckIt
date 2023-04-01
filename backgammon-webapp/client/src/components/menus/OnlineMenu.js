import React from 'react'
import './OnlineMenu.css'
import '../../App.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PlayOnline from '../pages/PlayOnline';
import  WaitingLobby from '../menus/online-menu/WaitingLobby'
import  CodedLobby  from '../menus/online-menu/CodedLobby'

const socket = require('../../connection').socket

function generateRandomGreekName() {
  const greekAlphabet = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega']

  return greekAlphabet[Math.floor(Math.random() * greekAlphabet.length)]
}

function OnlineMenu() {
  const [waitingPlayer, setWaitingPlayer] = useState(true)
  const [submit, setSubmit] = useState(false)
  const [create, setCreate] = useState(false)
  const [code, setCode] = useState("")
  const [isRandom, setIsRandom] = useState(true) 
  const [isCreator, setIsCreator] = useState(false)
  const [opponentJoin, setOpponentJoin] = useState(false)
  const [first, setFirst] = useState(false)
  const opponent = generateRandomGreekName()
  
  socket.on('game-start', (creator) => {
    if (socket.id === creator) {
      setFirst(true)
    }
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

  socket.on('player-joined', () => {
    setOpponentJoin(true)
  })

  socket.on('player-disconnected', () => {
    window.location.reload()
  })

  socket.off('opponent-left').on('opponent-left', () => {
    window.alert("Opponent player has disconnected")
  })

  function findGame() {
    socket.emit('find-game')
    setIsRandom(true)
    setSubmit(true)
  }

  function createGame() {
    socket.emit('create-game')
    setIsCreator(true)
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
      setOpponentJoin(true)
      setIsRandom(code)
      setSubmit(true)
      setCreate(true)
    }
  };

  return (
    <>
      {waitingPlayer ? submit ? create ? 
      <CodedLobby isCreator={isCreator} opponentJoin={opponentJoin} opponent={opponent} code={code}/>
      :
      <WaitingLobby />
      :
      <div className="online-menu-background">
        <div className="online-toprow">
          <Link to="/">
            <button className='online-leave-button'></button>
          </Link>
          <div className="online-header">Online Menu</div>
        </div>
        <div className="online-content-wrapper">
          <div className="online-content random-online">
            <div className="content-headpiece">Play Stranger</div>
            <div className="content-content">
              <p className="content-text">Get ready to show off your skills and see how well you fare against your new opponent!</p>
              <button className="content-button" onClick={() => {findGame()}}>Find</button>
            </div>
          </div>
          <div className="content-border"></div>
          <div className="online-content create-online">
            <div className="content-headpiece">Create Party</div>
            <div className="content-content">
              <p className="content-text">Share room code with your friends and they can join the same game.</p>
              <button className="content-button" onClick={() => {createGame()}}>Create</button>
            </div>
          </div>
          <div className="online-content join-online">
            <div className="content-headpiece">Join Party</div>
            <div className="content-content join-room">
              <p className="enter-code">Enter Room Code</p>
              <input className="code-input" type="text" value={code} onChange={handleInputChange} placeholder="Room Code:"/>
              <button className="content-button" onClick={() => {joinGame()}}>Join</button>
            </div>
          </div>
        </div>
      </div>
      : <PlayOnline isCreator={first} opponent={opponent} isRandom={isRandom}/>
      }
    </>
  )
}

export default OnlineMenu