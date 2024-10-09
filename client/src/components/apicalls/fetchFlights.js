// fetchFlight.js
import axios from 'axios';
import { isoDateToHHMM24, formatDuration } from '../helpers/general';

export const fetchFlights = async (data, isReturn) => {
  try {    
    const response = await axios.post('/api/v1/search/flight_offers', {
        origin: isReturn ? data.destinationIATA : data.departingIATA, // Origin is the destination IATA for return flights
        destination: isReturn ? data.departingIATA : data.destinationIATA, // Destination is the departing IATA for return flights
        departureDate: isReturn ? data.returnDate : data.departDate,
        adults: data.passengers,         // e.g., 1
        currencyCode: data.currencyCode,      // e.g., 'USD'
    });

    // Remapping of reponse data to a new flightData structure.
    if (response.data.data && response.data.data.length > 0) {
      const flightOffers = response.data.data;
      const carriers = response.data.result.dictionaries.carriers; // Extract carriers from dictionaries
      // console.log(flightOffers);
      // Map over flightOffers to a new flightData
      const filteredFlightOffers = flightOffers
        .filter(offer => {
          return offer.itineraries.every(itinerary => 
            itinerary.segments.every(segment =>
              !/^6X|7X|8X/.test(segment.carrierCode) // Removes these test carrier codes (only for development environment)
              // !/^6X|7X|8X/.test(segment.operating.carrierCode)
            )
          )
        });
      
      const itineraryData = filteredFlightOffers.flatMap(offer =>
        offer.itineraries.map(itinerary => {
          const lastSegment = itinerary.segments.length - 1;
          return {
            offerId: offer.id,
            departureIata: itinerary.segments[0].departure.iataCode,
            departureTime: isoDateToHHMM24(itinerary.segments[0].departure.at),
            duration: formatDuration(itinerary.duration),  // duration is array eg [HH:MM, timeInMintues]
            arrivalIata: itinerary.segments[lastSegment].arrival.iataCode,
            arrivalTime: isoDateToHHMM24(itinerary.segments[lastSegment].arrival.at),
            carrierCode: itinerary.segments[0].carrierCode,
            carrierLogo: `https://www.gstatic.com/flights/airline_logos/70px/${itinerary.segments[0].carrierCode}.png`,
            carrierName: carriers[itinerary.segments[0].carrierCode],
            stops: lastSegment,
            price: offer.price.total,
            currency: offer.price.currency,
          }
        })
      );
      // console.log(itineraryData);
      return itineraryData;
    }
    return [];
  } catch (err) {
    console.error("Error fetching flights:", err);
    throw new Error(err.message);
  }
};
