import React from 'react'
import './CheckerBox.css'

export const CheckerBox = (props) => {
    return (
        <>
            <div className={`outside-column ${props.side}`}>
                <div className="box-up"></div>
                <div className="box-middle">
                    {props.children}
                </div>
                <div className="box-down"></div>
            </div>
        </>
    )
};