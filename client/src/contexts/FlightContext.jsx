import React, { createContext, useContext, useState } from 'react';

const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
    const[flightData, setFlightData] = useState([]);

    return (
        <FlightContext.Provider value={{ flightData, setFlightData }}>
            {children}
        </FlightContext.Provider>
    );
};

export const useFlightContext = () => useContext(FlightContext);

