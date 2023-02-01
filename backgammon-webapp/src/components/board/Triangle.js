import React from 'react';
import './Triangle.css';

const STYLES = ['p1-color', 'p2-color', 'receivable'];

const ORIENTATION = ['tri--up', 'tri--down'];

export const Triangle = (props) => {
    const checkTriangleStyle = STYLES.includes(props.color) ? props.color : STYLES[0]

    const checkTriangleOrientation = ORIENTATION.includes(props.orientation) ? props.orientation : ORIENTATION[0]

    const checkMovable = props.pip.movable ? "click" : ""
    const checkMovableOnClick = props.pip.movable ? props.pip.movable : null

    const checkReceivable = props.pip.receivable ? "receivable" : ""
    const checkReceivableOnClick = props.pip.receivable ? props.pip.receivable : null
    
    return (
        <>
            <div className={`tri-column ${[checkMovable]}`} onClick={checkMovableOnClick}>
                <div className={`tri ${checkTriangleStyle} ${checkTriangleOrientation} ${[checkReceivable]}`} onClick={checkReceivableOnClick}></div>
                <div className={`checkers-column`}>
                    {props.children}
                </div>
            </div>
        </>
    )
};