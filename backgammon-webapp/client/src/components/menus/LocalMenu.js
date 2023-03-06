import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import './LocalMenu.css'

function LocalMenu() {
  return (
    <>
        <div className="local-wrapper">
            <div className="local-header">Choose Game Type:</div>
            <div className="local-type">
                <div className="type-cpu">
                    <div className="cpu-image"></div>
                    <div className="player-image"></div>
                </div>
                <div className="type-versus">
                    <div className="player-image"></div>
                    <div className="player-image"></div>
                </div>
            </div>
            <div className="type-labels">
                <div className="cpu-label">P1vsCPU</div>
                <div className="versus-label">P1vsP2</div>
            </div>
            <div className="local-rounds">
                <div className="round selected">1</div>
                <div className="round">3</div>
                <div className="round">5</div>
                <div className="round">7</div>
            </div>
            <div className="local-start">
                <Link to='/localPlay' className="local-link">
                    <button className="btn-start-game">Start Game</button>
                </Link>
            </div>
        </div>
    </>
  );
}

export default LocalMenu;