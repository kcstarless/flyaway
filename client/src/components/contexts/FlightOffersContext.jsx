import React, { createContext, useContext, useState } from 'react';

const FlightOffersContext = createContext();

export const FlightOffersProvider = ({ children }) => {
    const[flightOffersData, setFlightOffersData] = useState([]);

    return (
        <FlightOffersContext.Provider value={{ flightOffersData, setFlightOffersData }}>
            {children}
        </FlightOffersContext.Provider>
    );
};

export const useFlightOffersContext = () => useContext(FlightOffersContext);

