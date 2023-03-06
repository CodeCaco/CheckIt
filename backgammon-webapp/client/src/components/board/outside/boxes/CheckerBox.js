import React from 'react'
import './CheckerBox.css'

export const CheckerBox = (props) => {
    let up, down, upReceivable, upClick, downReceivable, downClick = null

    const checkReceivable = props.box.receivable ? "box-receivable" : ""
    const checkReceivableOnClick = props.box.receivable ? props.box.receivable : null

    const checkLeftSide = props.side === "left" ? true : false
    if (checkLeftSide) {
        up = props.checker
        upReceivable = checkReceivable
        upClick = checkReceivableOnClick
    } else {
        down = props.checker
        downReceivable = checkReceivable
        downClick = checkReceivableOnClick
    }
    return (
        <>
            <div className={`counter ${props.side}`}>Checkers: {props.box.checkers}</div>
            <div className={`outside-column ${props.side}`}>
                <div className={`box-up ${upReceivable}`} onClick={upClick}>
                    {up}
                </div>
                <div className="box-middle">
                    {props.children}
                </div>
                <div className={`box-down ${downReceivable}`} onClick={downClick}>
                    {down}
                </div>
            </div>
        </>
    )
};