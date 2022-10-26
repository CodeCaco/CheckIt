import React from 'react';
import '../../App.css';
import HeroSection from '../HeroSection';
import {Triangle} from '../board/Triangle';

function Home() {
  return (
    <>
    <HeroSection />
    <div className="triangleTest">
      <Triangle />
      <Triangle triangleStyle={'tri--two'} triangleOrientation={'tri--up'}/>
    </div>
    </>
  );
}

export default Home;