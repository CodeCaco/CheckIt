import React from 'react';
import './RollDice.css';
import {Dice} from './Dice'

export const RollDice = (props) => {
    return (
        <>
            <div id="rollDie" className="outside-btn" onClick={props.rollDice}>
                <Dice click="clickable" face={props.face}/>
            </div>
        </>
    )
};