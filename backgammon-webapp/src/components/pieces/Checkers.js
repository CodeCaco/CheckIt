import React from 'react'
import './Checkers.css'

const COLORS = ['checker-red', 'checker-white'];


export const Checkers = (props) => {
    const checkCheckerCOLOR = COLORS.includes(props.color) ? props.color : COLORS[0]
    
    const checkMovable = props.movable ? "movable" : ""

    return (
        <>
            <div style={props.style} className={`checker-format ${[checkCheckerCOLOR]} ${[checkMovable]}`}></div>
        </>
    )
};