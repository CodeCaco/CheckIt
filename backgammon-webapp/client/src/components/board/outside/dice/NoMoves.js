import React from 'react'
import './NoMoves.css'

export const NoMoves = (props) => {
  return (
    <>
        <div className='no-moves-shadow' style={{"--height": props.height, "--width": props.width}}>
          <div className='no-moves-overlay'>
            <button className='close-no-moves' onClick={props.onClick}></button>
            <div className='header-no-moves'>No Moves Available</div>
          </div>
        </div>
    </>
  )
};