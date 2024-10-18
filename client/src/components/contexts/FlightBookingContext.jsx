import { createContext, useContext, useState, useEffect } from 'react';
import { useFlightOffersContext } from './FlightOffersContext';
import { fetchFlightPricing } from '../apicalls/fetchFlightPricing';

const FlightBookingContext = createContext();

export const FlightBookingProvider = ({ children }) => {
    const { selectedOutboundFlight, selectedReturnFlight } = useFlightOffersContext();

    const [pricingOutbound, setPricingOutbound] = useState(null);
    const [pricingReturn, setPricingReturn] = useState(null);

    useEffect(() => {
        const fetchPricing = async () => {
            if (selectedOutboundFlight) {
              try {
                const response = await fetchFlightPricing(selectedOutboundFlight);
                setPricingOutbound(response);
              } catch (error) {
                console.error("Error fetching outbound flight pricing:", error);
              }
            }
            
            if (selectedReturnFlight) {
              try {
                const response = await fetchFlightPricing(selectedReturnFlight);
                setPricingReturn(response);
              } catch (error) {
                console.error("Error fetching return flight pricing:", error);
              }
            }
          };
        
          fetchPricing();
    }, [selectedOutboundFlight, selectedReturnFlight]);

    console.log(pricingOutbound);
    console.log(pricingReturn);
    
    return (
        <FlightBookingContext.Provider value= {{
            pricingOutbound,
            pricingReturn,
        }}>
            {children}
        </FlightBookingContext.Provider>
    )

}

export const useFlightBookingContext = () => useContext(FlightBookingContext);