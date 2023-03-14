import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import LocalMenu from './components/menus/LocalMenu';
import OnlineMenu from './components/menus/OnlineMenu';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Footer from './components/Footer';
import Play from './components/pages/Play';

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Home />}/>
        <Route path='/localMenu' element={<LocalMenu />}/>
        <Route path='/online' element={<OnlineMenu />}/>
        <Route path='/localPlay' element={<Play />}/>
      </Routes>
      <Footer />
    </Router>
    </>
  );
}

export default App;
