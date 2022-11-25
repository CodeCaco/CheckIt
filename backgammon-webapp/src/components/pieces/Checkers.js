import React from 'react'
import './Checkers.css'

const COLORS = ['checker-red', 'checker-white' , 'movable'];


export const Checkers = (props) => {
    const checkCheckerCOLOR = COLORS.includes(props.color) ? props.color : COLORS[0]
    
    return (
        <>
            <div className={`checker-format ${[checkCheckerCOLOR]}`}></div>
        </>
    )
};