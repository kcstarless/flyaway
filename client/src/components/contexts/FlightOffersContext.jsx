import { createContext, useContext, useState } from 'react';

const FlightOffersContext = createContext();

export const FlightOffersProvider = ({ children }) => {
    const[flightOffers, setFlightOffers] = useState([]);
    const[flightPriceHistory, setFlightPriceHistory] = useState([]);
    const[isReturn, setIsReturn] = useState(false);
    const[selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);
    const[selectedReturnFlight, setSelectedReturnFlight] = useState(null);

    return (
        <FlightOffersContext.Provider value={{ 
            flightOffers, 
            setFlightOffers,
            flightPriceHistory,
            setFlightPriceHistory,
            selectedOutboundFlight,
            setSelectedOutboundFlight,
            selectedReturnFlight,
            setSelectedReturnFlight,
             }}>
            {children}
        </FlightOffersContext.Provider>
    );
};

export const useFlightOffersContext = () => useContext(FlightOffersContext);

