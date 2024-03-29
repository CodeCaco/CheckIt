import React from 'react'
import './WaitingLobby.css'

function WaitingLobby() {

  function handleOnlineConnection() {
    window.location.reload()
  }

  return (
    <div className='waited-background'>
      <div className='waited-header'>Waiting for player<p className='p-dot'></p><p className='p-dot'></p><p className='p-dot'></p><p className='p-dot'></p></div>
      <div className='leave-button' onClick={handleOnlineConnection}>Cancel</div>
    </div>
  )
}

export default WaitingLobby