import React from 'react';
import './Triangle.css';

const STYLES = ['tri--one', 'tri--two'];

const ORIENTATION = ['tri--up', 'tri--down'];

export const Triangle = ({triangleStyle, triangleOrientation}) => {
    const checkTriangleStyle = STYLES.includes(triangleStyle) ? triangleStyle : STYLES[0]

    const checkTriangleOrientation = ORIENTATION.includes(triangleOrientation) ? triangleOrientation : ORIENTATION[0]

    return (
        <>
            <div className={`tri ${checkTriangleStyle} ${checkTriangleOrientation}`}></div>
        </>
    )
};