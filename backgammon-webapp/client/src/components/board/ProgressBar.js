import React from 'react'
import './ProgressBar.css'

export const ProgressBar = (props) => {
  // const renderTicks = () => {
  //   const ticks = [];
  //   for (let i = 1; i < 10; i++) {
  //     ticks.push(<div key={i} className="tick" style={{ left: i * 10 + "%" }}></div>);
  //   }
  //   return ticks;
  // };

  return (
    <>
      {/* <div className="progress-bar"> */}
        <div className="white-bar">
          <div style={{"--red-percentage": props.redWP + "%"}} className="red-bar"></div>
          {/* {renderTicks()} */}
        </div>
      {/* </div> */}
    </>
  )
};