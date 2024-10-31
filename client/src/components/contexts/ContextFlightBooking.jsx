import { createContext, useContext, useState, useEffect } from 'react';
import { useContextFlightOffers } from './ContextFlightOffers';
import { fetchFlightPricing } from '../apicalls/fetchFlightPricing';

const ContextFlightBooking = createContext();

export const ProviderContextFlightBooking = ({ children }) => {
    const { selectedOutboundFlight, selectedReturnFlight } = useContextFlightOffers();

    const [pricingOutbound, setPricingOutbound] = useState(null);
    const [pricingReturn, setPricingReturn] = useState(null);
    const [bookedOutbound, setBookedOutbound] = useState({});
    const [bookedReturn, setBookedReturn] = useState({});
    const [travelerInfo, setTravelerInfo] = useState(null);

    const passengers = selectedOutboundFlight?.offer.travelerPricings.length; // Total number of passengers
    const grandTotal = getTotalPrice();

    // Check the selected offer for flight is still valid.
    // This step is necessary for Amadeus API flight booking flow. 
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
    
    // Get total price of the flights
    function getTotalPrice() {
      if (!selectedOutboundFlight) {
        return null;
      }  
      
      return selectedReturnFlight ? selectedOutboundFlight.price + selectedReturnFlight.price : selectedOutboundFlight.price;
    }

    function resetFlightBooking() {
        console.log("Resetting flight booking context");
        setPricingOutbound(null);
        setPricingReturn(null);
        setBookedOutbound({});
        setBookedReturn({});
        setTravelerInfo(null);
    }

    return (
        <ContextFlightBooking.Provider value= {{
            pricingOutbound,
            pricingReturn,
            bookedOutbound,
            setBookedOutbound,
            bookedReturn,
            setBookedReturn,
            grandTotal,
            passengers,
            travelerInfo,
            setTravelerInfo,
            resetFlightBooking,
        }}>
            {children}
        </ContextFlightBooking.Provider>
    )

}

export const useContextFlightBooking = () => useContext(ContextFlightBooking);