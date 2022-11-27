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
            <div className="dice-column">
                <span className="btn-dot"></span>
                <span className="btn-dot"></span>
            </div>
            <div className="dice-column">
                <span className="btn-dot"></span>
                <span className="btn-dot"></span> 
            </div>
        </div>
    )
}

const five = (props) => {
    return (
        <div className={`btn-dice ${props} five`}>
            <div className="dice-column">
                <span className="btn-dot"></span>
                <span className="btn-dot"></span>
            </div>
            <div className="dice-column">
                <span className="btn-dot"></span>
            </div>
            <div className="dice-column">
                <span className="btn-dot"></span>
                <span className="btn-dot"></span> 
            </div>
        </div>
    )
}

const six = (props) => {
    return (
        <div className={`btn-dice ${props} six`}>
            <div className="dice-column">
                <span className="btn-dot"></span>
                <span className="btn-dot"></span>
                <span className="btn-dot"></span>
            </div>
            <div className="dice-column">
                <span className="btn-dot"></span>
                <span className="btn-dot"></span>
                <span className="btn-dot"></span> 
            </div>
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