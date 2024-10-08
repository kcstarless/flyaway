import logo_plane from '../assets/images/logo_plane.svg';
import Localization from './navbar/Localization';
import login_icon from '../assets/images/icon_login.svg';
import React, { useState } from 'react';

function Navbar() {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleMenuClick = (index) => {
        setActiveIndex(index);
      };
    

    return (
        <>
            <div className="header-bar">
                <div className="logo">
                    <img src={logo_plane} alt="logo" className="logo-image" />
                    <div className="title">
                        <div className="title-header">Flyaway</div>
                        <div className="title-description">Go now. Fly now. </div>
                    </div>
                </div>
                <div className="user-info">
                    <Localization />
                    <div className="user-login">
                        <a href="#"><img src={login_icon} alt="login" className="login-icon" /></a>
                    </div>
                </div>
            </div>
            <div className="nav-bar">
                <nav>
                    <ul>
                    {['Flight', 'Hotel', 'Destination'].map((item, index) => (
                        <li key={index}>
                            <a
                            href="#"
                            onClick={() => handleMenuClick(index)}
                            className={activeIndex === index ? 'active' : ''}
                            >
                            {item}
                            </a>
                        </li>
                    ))}
                    </ul>
                </nav>
            </div>

        </>
    );
}

export default Navbar;