import React from 'react';
import { Button } from './Button';
import './HeroSection.css';
import '../App.css';

function HeroSection() {
  return (
    <div className='hero-container'>
        <h1>A NEW GAME AWAITS</h1>
        <p>What are you waiting for?</p>
        <div className="hero-btns">
            <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large' whereTo='play'>Local</Button>
            <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large' whereTo='play2'>Online</Button>
        </div>
        
    </div>
  )
}

export default HeroSection;