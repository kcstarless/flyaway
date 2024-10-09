import React, { createContext, useContext, useState } from 'react';

const FlightOffersContext = createContext();

export const FlightOffersProvider = ({ children }) => {
    const[flightOffersData, setFlightOffersData] = useState([]);
    const[priceHistory, setPriceHistory] = useState([]);

    return (
        <FlightOffersContext.Provider value={{ 
            flightOffersData, 
            setFlightOffersData,
            priceHistory,
            setPriceHistory,
             }}>
            {children}
        </FlightOffersContext.Provider>
    );
};

export const useFlightOffersContext = () => useContext(FlightOffersContext);

