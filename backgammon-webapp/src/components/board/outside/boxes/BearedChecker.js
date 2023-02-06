import React from 'react'
import './BearedChecker.css'

const COLORS = ['checker-red', 'checker-white'];


export const BearedChecker = (props) => {
    const checkCheckerCOLOR = COLORS.includes(props.color) ? props.color : COLORS[0]
    
    return (
        <>
            <div className={`side-checker ${[checkCheckerCOLOR]}`}></div>
        </>
    )
}; 