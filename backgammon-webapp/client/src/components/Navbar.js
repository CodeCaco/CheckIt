import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Button } from './Button';
import './Navbar.css'

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const handleLogoClick = () => {
    setClick(false);
    const socket = require('../connection').socket
    socket.disconnect()
  }
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if(window.innerWidth <= 960) {
        setButton(false);
    } else {
        setButton(true);
    }
  };

  // this makes it so Sign Up doesn't pop up in mobile view when refreshed
  useEffect(() => {
    showButton(false);
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
        <nav className='navbar'>
            <div className='navbar-container'>
                <Link to="/" className="navbar-logo" onClick={handleLogoClick}>
                    CheckIt &nbsp;<i className="fa-solid fa-circle-xmark"></i>
                </Link>
                <div className='menu-icon' onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                            Home
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/rules' className='nav-links' onClick={closeMobileMenu}>
                            Rules
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/sign-up' className='nav-links-mobile' onClick={closeMobileMenu}>
                            Sign Up
                        </Link>
                    </li>
                </ul>
                {button && <Button buttonStyle='btn--outline'>Sign Up</Button>}
            </div>
        </nav>
    </>
  )
}

export default Navbar