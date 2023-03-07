import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import LocalMenu from './components/menus/LocalMenu';
import OnlineMenu from './components/menus/OnlineMenu';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Footer from './components/Footer';

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Home />}/>
        <Route path='/localMenu' element={<LocalMenu />}/>
        <Route path='/onlineMenu' element={<OnlineMenu />}/>
      </Routes>
      <Footer />
    </Router>
    </>
  );
}

export default App;
