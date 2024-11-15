// FlightDetails.jsx
import { useMemo, useState, useEffect, useRef } from 'react';
import { fetchLocation } from '../apicalls/fetchLocation';
import { getDateDayDDMMYYYY } from '../helpers/general';
import BookingFlightDetailsExpanded from './BookingFlightDetailsExpanded';
import { setSessionstorageItem, getSessionstorageItem } from '../helpers/localstorage';
import { useContextFlightOffers } from '../contexts/ContextFlightOffers';
import { get } from 'react-hook-form';


// Fetch location details for each segment
async function fetchSegmentLocations(flight, newLocations) {
    for (const segment of flight) {
        const departureIATA = segment.departure.iataCode;
        const arrivalIATA = segment.arrival.iataCode;

        if (departureIATA && !newLocations[departureIATA]) {
            newLocations[departureIATA] = await fetchLocation(departureIATA);
        }
        if (arrivalIATA && !newLocations[arrivalIATA]) {
            newLocations[arrivalIATA] = await fetchLocation(arrivalIATA);
        }
    }
}

const BookingFlightDetails = () => {
    console.log("FlightDetails rendered...");
    const outboundFlight = getSessionstorageItem('selectedOutboundFlight');
    const returnFlight = getSessionstorageItem('selectedReturnFlight');
    const { locations, setLocations } = useContextFlightOffers();
    // const [newLocations, setNewLocations] = useState(null);
    const outboundItineraries = outboundFlight?.offer.itineraries[0].segments;
    const returnItineraries = returnFlight?.offer.itineraries[0].segments;
    // const locationsRef = useRef(getSessionstorageItem('locations') || {});// To store location data

    // Memoize the newLocations object to prevent re-fetching on every render
    useEffect(() => {
        const locationsInSession = getSessionstorageItem('locations');
        
        // Only fetch and update locations if they don't exist or are different from the current state
        if (!locationsInSession || Object.keys(locationsInSession).length === 0) {
            const airports = {};
            const fetchLocations = async () => {
                if (outboundItineraries) {
                    await fetchSegmentLocations(outboundItineraries, airports);
                }
                if (returnItineraries) {
                    await fetchSegmentLocations(returnItineraries, airports);
                }

                // Avoid unnecessary updates if the locations are the same
                if (Object.keys(airports).length > 0) {
                    setLocations(airports);  // Update context state
                    setSessionstorageItem('locations', airports);  // Save to sessionStorage
                }
            };
            fetchLocations();
        }
    }, [outboundItineraries, returnItineraries, setLocations]);

    console.log("locations:", locations);


    if (!outboundFlight && !returnFlight) { 
        return null; // Or handle the loading state appropriately
    }
    return (
        <div className="flight-details">
            <div className="details-header">
                <h3 className="float-right">Flight details</h3>
            </div>

            {outboundFlight && (
                <>
                    <div className="flight-bound"><b>Outbound</b><p className="medium-small gray">{getDateDayDDMMYYYY(outboundFlight.departureDateTime)}</p></div>
                    <BookingFlightDetailsExpanded 
                    flight = {outboundFlight}
                    locations = {locations}
                    />   
                </>
            )}
    
            {returnFlight && (
                <>
                    <div className="flight-bound"><b>Return</b><p className="medium-small gray">{getDateDayDDMMYYYY(returnFlight.departureDateTime)}</p></div>
                    <BookingFlightDetailsExpanded 
                    flight = {returnFlight}
                    locations = {locations}
                    />
                </>
            )}
        </div>
    );    
};

export default BookingFlightDetails;
