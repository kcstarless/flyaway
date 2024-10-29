// FlightDetails.jsx
import { useContextFlightOffers } from '../contexts/ContextFlightOffers';
import { useState, useEffect, useRef } from 'react';
import { fetchLocation } from '../apicalls/fetchLocation';
import { getDateDayDDMMYYYY } from '../helpers/general';
import BookingFlightDetailsExpanded from './BookingFlightDetailsExpanded';

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
    const { selectedOutboundFlight, selectedReturnFlight } = useContextFlightOffers();
    const [outboundDetailsOpen, setOutboundDetailsOpen] = useState(false);
    const [returnDetailsOpen, setReturnDetailsOpen] = useState(false);
    const locationsRef = useRef({});// To store location data
    const outboundItineraries = selectedOutboundFlight?.offer.itineraries[0].segments;
    const returnItineraries = selectedReturnFlight?.offer.itineraries[0].segments;
    const outboundCarriers = selectedOutboundFlight?.carriers || {};
    const returnCarriers = selectedReturnFlight?.carriers || {};
    const carriers = { ...outboundCarriers, ...returnCarriers };

    // Fetch location details for each segment
    useEffect(() => {
        const fetchLocations = async () => {
            const newLocations = {};
            if(outboundItineraries){
                await fetchSegmentLocations(outboundItineraries, newLocations);
            }
            if(returnItineraries) {
                await fetchSegmentLocations(returnItineraries, newLocations);
            }
            locationsRef.current = newLocations;
        };

        fetchLocations();
    }, [outboundItineraries, returnItineraries]);

    if (!selectedOutboundFlight && !selectedReturnFlight) { 
        return null; // Or handle the loading state appropriately
    }
    
    return (
        <div className="flight-details">
            <h3 className="float-right">Flight details</h3>

            {selectedOutboundFlight && (
                <>
                    <div className="flight-bound"><b>Outbound</b><p className="medium-small gray">{getDateDayDDMMYYYY(selectedOutboundFlight.departureDateTime)}</p></div>
                    <BookingFlightDetailsExpanded 
                    flight = {selectedOutboundFlight}
                    detailsOpen = {outboundDetailsOpen}
                    setDetailsOpen = {setOutboundDetailsOpen}
                    itineraries = {outboundItineraries}
                    locations = {locationsRef.current}
                    carriers = {carriers}
                    />   
                </>
            )}
    
            {selectedReturnFlight && (
                <>
                    <div className="flight-bound"><b>Return</b><p className="medium-small gray">{getDateDayDDMMYYYY(selectedReturnFlight.departureDateTime)}</p></div>
                    <FlightDetailsExpanded 
                    flight = {selectedReturnFlight}
                    detailsOpen = {returnDetailsOpen}
                    setDetailsOpen = {setReturnDetailsOpen}
                    itineraries = {returnItineraries}
                    locations = {locationsRef.current}
                    carriers = {carriers}
                    />
                </>
            )}
        </div>
    );    
};

export default BookingFlightDetails;
