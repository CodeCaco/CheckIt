import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import Play from './components/pages/Play'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Footer from './components/Footer';

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Home />}/>
        <Route path='/play' element={<Play test="abc"/>}/>
        <Route path='/play2' element={<Play test="123"/>}/>
      </Routes>
      <Footer />
    </Router>
    </>
  );
}

export default App;
