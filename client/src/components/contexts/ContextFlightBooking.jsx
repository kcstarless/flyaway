import { createContext, useContext, useState, useEffect } from 'react';
import { useContextFlightOffers } from './ContextFlightOffers';
import { fetchFlightPricing } from '../apicalls/fetchFlightPricing';
import { clearSessionstorage, setSessionstorageItem } from '../helpers/localstorage';
import { getSessionstorageItem, setLocalstorageItem } from '../helpers/localstorage';

const ContextFlightBooking = createContext();

export const ProviderContextFlightBooking = ({ children }) => {
    const { selectedOutboundFlight, selectedReturnFlight } = useContextFlightOffers();
    const outboundFlight = getSessionstorageItem('selectedOutboundFlight');
    const returnFlight = getSessionstorageItem('selectedReturnFlight');
    const [pricingOutbound, setPricingOutbound] = useState(getSessionstorageItem('pricingOutbound') || null);
    const [pricingReturn, setPricingReturn] = useState(getSessionstorageItem('pricingReturn') || null);
    const [bookedOutbound, setBookedOutbound] = useState(getSessionstorageItem('bookedOutbound') || {});
    const [bookedReturn, setBookedReturn] = useState(getSessionstorageItem('bookedReturn') || {});
    const [travelerInfo, setTravelerInfo] = useState(getSessionstorageItem('travelerInfo') || null);

    const passengers = selectedOutboundFlight?.offer.travelerPricings.length; // Total number of passengers
    const grandTotal = getTotalPrice();

    // Check the selected offer for flight is still valid.
    // This step is necessary for Amadeus API flight booking flow. 
    useEffect(() => {
        const fetchPricing = async () => {
          console.log("Checking pricing outbound flight...");

              try {
                const response = await fetchFlightPricing(selectedOutboundFlight);
                setPricingOutbound(response);
                setSessionstorageItem('pricingOutbound', response);
                console.log("pricingOutbound: ", response);
              } catch (error) {
                console.error("Error fetching outbound flight pricing:", error);
              }

          };
          if (selectedOutboundFlight) {
            fetchPricing();
          }

    }, [selectedOutboundFlight]);

    useEffect(() => {
      const fetchPricing = async () => {
        console.log("Checking pricing return flight...");
            try {
              const response = await fetchFlightPricing(selectedReturnFlight);
              setPricingReturn(response);
              setSessionstorageItem('pricingReturn', response);
              console.log("pricingReturn: ", response);
            } catch (error) {
              console.error("Error fetching return flight pricing:", error);
            }
        }
        if (selectedReturnFlight){
          fetchPricing();
        }
    }, [selectedReturnFlight]);
    
    // Get total price of the flights
    function getTotalPrice() {
      if (!outboundFlight) {
        return null;
      }  
      
      return returnFlight ? outboundFlight.price + returnFlight.price : outboundFlight.price;
    }

    function resetFlightBooking() {
        // console.log("Resetting flight booking context");
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