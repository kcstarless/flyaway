import React, { useState } from 'react';
// import './ToggleLocations.css';

const ToggleLocations = () => {
    const [isSwapped, setIsSwapped] = useState(false);
    const [departure, setDeparture] = useState('New York');
    const [destination, setDestination] = useState('Los Angeles');

    const handleToggle = () => {
        setIsSwapped(!isSwapped);
    };

    return (
        <div className="location-toggle">
            <input 
                type="text" 
                value={isSwapped ? destination : departure} 
                readOnly 
                className="location-input left-input"
            />
            <button className="toggle-button" onClick={handleToggle}>
                <span className={`arrow ${isSwapped ? 'flipped' : ''}`}>&#8596;</span>
            </button>
            <input 
                type="text" 
                value={isSwapped ? departure : destination} 
                readOnly 
                className="location-input right-input"
            />
        </div>
    );
};

export default ToggleLocations;
