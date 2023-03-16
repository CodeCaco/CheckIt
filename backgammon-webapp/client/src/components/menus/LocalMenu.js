import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../../App.css';
import './LocalMenu.css'

function LocalMenu() {
    let [cpu, versus] = [null, null]
    let [one, three, five, seven] = [null, null, null, null]
    let [red, white] = [null, null]

    const [type, setType] = useState(1)
    const [rounds, setRounds] = useState(1)
    const [turns, setTurns] = useState(1)

    switch (type) {
        case 1:
            cpu = "highlight"
            versus = null
            break
        case 2:
            cpu = null
            versus = "highlight"
            break
        default:
            cpu = "highlight"
            versus = null
    }

    switch (rounds) {
        case 1:
            one = "highlight"
            three = null
            five = null
            seven = null
            break
        case 3:
            three = "highlight"
            one = null
            five = null
            seven = null
            break
        case 5:
            five = "highlight"
            three = null
            one = null
            seven = null
            break
        case 7:
            seven = "highlight"
            three = null
            five = null
            one = null
            break
        default:
            one = "highlight"
            three = null
            five = null
            seven = null
    }

    switch (turns) {
        case 1:
            red = "highlight"
            white = null
            break
        case 2:
            red = null
            white = "highlight"
            break
        default:
            red = "highlight"
            white = null
    }
 
    return (
    <>
        <div className="local-wrapper">
            <Link to="/">
                <button className='local-leave-button'></button>
            </Link>
            <div className="local-template game-types">
                <div className="type-header">Game Type:</div>
                <div className="types">
                    <div className={`type-template ${cpu}`} onClick={() => {setType(1)}}>
                        <div className="type-image image-cpu"></div>
                        <div className="type-label">vs Robot</div>
                    </div>
                    <div className={`type-template ${versus}`} onClick={() => {setType(2)}}>
                        <div className="type-image image-versus"></div>
                        <div className="type-label">vs Player</div>
                    </div>
                </div>
            </div>
            <div className="local-template game-rounds">
                <div className="type-header">Play To:</div>
                <div className="rounds">
                    <div className={`round-button ${one}`} onClick={() => {setRounds(1)}}>1</div>
                    <div className={`round-button ${three}`} onClick={() => {setRounds(3)}}>3</div>
                    <div className={`round-button ${five}`} onClick={() => {setRounds(5)}}>5</div>
                    <div className={`round-button ${seven}`} onClick={() => {setRounds(7)}}>7</div>
                </div>
            </div>
            <div className="local-template game-turns">
                <div className="type-header">{cpu ? "Checker Colour" : "Player to Start"}</div>
                <div className="turns">
                    <div className={`turn-template ${red}`} onClick={() => {setTurns(1)}}>
                        <div className="checker-format checker-red turn"></div>
                    </div>
                    <div className={`turn-template ${white}`} onClick={() => {setTurns(2)}}>
                        <div className="checker-format checker-white turn"></div>
                    </div>
                    <button className='local-start-button'>Start</button>
                </div>
            </div>
        </div>
    </>
  );
}

export default LocalMenu;