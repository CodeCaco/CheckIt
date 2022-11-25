import React from 'react'
import './CheckerBox.css'

export const CheckerBox = (props) => {
    return (
        <>
            <div className= {`greybox ${props.placement}`}></div>
        </>
    )
};