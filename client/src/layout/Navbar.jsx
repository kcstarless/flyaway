import logo_plane from '../assets/images/logo_plane.svg';
import Localization from '../components/navbar/Localization';
import UserLogin from '../components/navbar/UserLogin';
import  Unavailable from '../components/helpers/Unavailable';

import React, { useState } from 'react';

function Navbar() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [unavailable, setUnavailable] = useState(false);

    const handleMenuClick = (index, item) => {
        setActiveIndex(index);
        if (item === 'Destination' || item === 'Hotel') {
            setUnavailable(true);
        } else {
            setUnavailable(false);
        }
    };

    return (
        <>
            <div className="header-bar">
                <a className="logo" href="/">
                    <img src={logo_plane} alt="logo" className="logo-image" />
                    <div className="title">
                        <div className="title-header">Flyaway</div>
                        <div className="title-description">Go now. Fly now. </div>
                    </div>
                </a>
                <div className="user-info">
                    <Localization />
                    <UserLogin />
 
                </div>
            </div>
            <div className="nav-bar">
                <nav>
                    <ul>
                    {['Flight', 'Hotel', 'Destination'].map((item, index) => (
                        <li key={index}>
                            <a
                            href={item === 'Flight' ? `/` : `#`}
                            onClick={() => handleMenuClick(index, item)}
                            className={activeIndex === index ? 'active' : ''}
                            aria-disabled
                            >
                            {item}
                            </a>
                        </li>
                        
                    ))}
                    
                    </ul>
                </nav>
            </div>
            {unavailable && <Unavailable setUnavailable={setUnavailable} />}
        </>
    );
}

export default Navbar;