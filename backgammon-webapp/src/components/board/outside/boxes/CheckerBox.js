import React from 'react'
import './CheckerBox.css'

export const CheckerBox = (props) => {
    let up, down = null

    const checkLeftSide = props.side === "left" ? true : false
    if (checkLeftSide) {
        up = props.checker
    } else {
        down = props.checker
    }
    return (
        <>
            <div className={`counter ${props.side}`}>Checkers: {props.box.checkers}</div>
            <div className={`outside-column ${props.side}`}>
                <div className="box-up">
                    {up}
                </div>
                <div className="box-middle">
                    {props.children}
                </div>
                <div className="box-down">
                    {down}
                </div>
            </div>
        </>
    )
};