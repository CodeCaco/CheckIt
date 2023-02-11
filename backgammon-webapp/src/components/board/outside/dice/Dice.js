import React from 'react';
import './Dice.css';

const one = (props) => {
    return (
        <div className={`btn-dice ${props} one`}>
            <span className="btn-dot"></span>
        </div>
    )
}

const two = (props) => {
    return (
        <div className={`btn-dice ${props} two`}>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span>
        </div>
    )
}

const three = (props) => {
    return (
        <div className={`btn-dice ${props} three`}>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span>
        </div>
    )
}

const four = (props) => {
    return (
        <div className={`btn-dice ${props} four`}>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span> 
        </div>
    )
}

const five = (props) => {
    return (
        <div className={`btn-dice ${props} five`}>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span> 
        </div>
    )
}

const six = (props) => {
    return (
        <div className={`btn-dice ${props} six`}>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span>
            <span className="btn-dot"></span> 
        </div>
    )
}

export const Dice = (props) => {
    const clickable = props.click === "clickable" ? props.click : "";

    var face = null
    switch(props.face) {
        case 1:
            face = one(clickable);
            break;
        case 2:
            face = two(clickable);
            break;
        case 3:
            face = three(clickable);
            break;
        case 4:
            face = four(clickable);
            break;
        case 5:
            face = five(clickable);
            break;
        case 6:
            face = six(clickable);
            break;
        default:
            break;
    }

    return (
        <>
            {face}
        </>
    )
};