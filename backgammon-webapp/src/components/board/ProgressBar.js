import React from 'react'
import './ProgressBar.css'

export const ProgressBar = (props) => {
  return (
    <>
      <div className="white-bar">
        <div style={{"--red-percentage": props.redWP + "%"}} className="red-bar"></div>
      </div>
    </>
  )
};