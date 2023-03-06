import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import '../App.css';

function Homepage() {
  return (
    <div className='home-content'>
        <div className="home-header">A new game awaits!</div>
        <div className="home-subheader">What are you waiting for?</div>
        <div className="home-hero">
          <img alt="Board" className="board-image" src={require("../assets/board.png")}></img>
          <div className="home-buttons">
            <Link to="/localMenu" className='noDecor'>
              <button className="hero-button">
                <div className="button-image local-image"></div>
                <div className="button-label">Play Locally</div>
              </button>
            </Link>
            <Link to="/play2" className='noDecor'>
              <button className="hero-button">                
                <div className="button-image online-image"></div>
                <div className="button-label">Play Online</div>
              </button>
            </Link>
          </div>
        </div>
    </div>
  )
}

export default Homepage;