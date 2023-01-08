import React from 'react';
import './Triangle.css';

const STYLES = ['p1-color', 'p2-color', 'receivable'];

const ORIENTATION = ['tri--up', 'tri--down'];

export const Triangle = (props) => {
    const checkTriangleStyle = STYLES.includes(props.color) ? props.color : STYLES[0]

    const checkTriangleOrientation = ORIENTATION.includes(props.orientation) ? props.orientation : ORIENTATION[0]

    const clickable = props.clickable === " click" ? props.clickable : ""

    return (
        <>
            <div className="tri-column">
                <div className={`tri ${checkTriangleStyle} ${checkTriangleOrientation}`}></div>
                <div className={`checkers-column${clickable}`}>
                    {props.children}
                </div>
            </div>
        </>
    )
};