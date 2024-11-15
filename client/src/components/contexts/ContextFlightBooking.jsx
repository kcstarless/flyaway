import { createContext, useContext, useState, useEffect } from 'react';
import { useContextFlightOffers } from './ContextFlightOffers';
import { fetchFlightPricing } from '../apicalls/fetchFlightPricing';
import { clearSessionstorage, setSessionstorageItem } from '../helpers/localstorage';
import { getSessionstorageItem, setLocalstorageItem } from '../helpers/localstorage';
import { get, set } from 'react-hook-form';

const ContextFlightBooking = createContext();

export const ProviderContextFlightBooking = ({ children }) => {
    const { selectedOutboundFlight, selectedReturnFlight } = useContextFlightOffers();
    const outboundFlight = getSessionstorageItem('selectedOutboundFlight');
    const returnFlight = getSessionstorageItem('selectedReturnFlight');
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
            if (selectedOutboundFlight && !getSessionstorageItem('pricingOutbound')) {
              console.log("started fetching pricing for outbound flight");
              try {
                const response = await fetchFlightPricing(selectedOutboundFlight);
                setPricingOutbound(response);
                setSessionstorageItem('pricingOutbound', response);
              } catch (error) {
                console.error("Error fetching outbound flight pricing:", error);
              }
            }
  
            if (selectedReturnFlight && !getSessionstorageItem('pricingReturn')) {
              try {
                const response = await fetchFlightPricing(selectedReturnFlight);
                setPricingReturn(response);
                setSessionstorageItem('pricingReturn', response);
              } catch (error) {
                console.error("Error fetching return flight pricing:", error);
              }
            }
          };
          // if (selectedOutboundFlight || selectedReturnFlight) {
          //   console.log("Fetching Pricing...");
            fetchPricing();
          // }
    }, [selectedOutboundFlight, selectedReturnFlight]);
    
    // Get total price of the flights
    function getTotalPrice() {
      if (!outboundFlight) {
        return null;
      }  
      
      return returnFlight ? outboundFlight.price + returnFlight.price : outboundFlight.price;
    }

    function resetFlightBooking() {
        console.log("Resetting flight booking context");
        setPricingOutbound(null);
        setPricingReturn(null);
        setBookedOutbound({});
        setBookedReturn({});
        setTravelerInfo(null);
        clearSessionstorage();
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