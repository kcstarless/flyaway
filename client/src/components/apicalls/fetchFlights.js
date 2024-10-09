// fetchFlight.js
import axios from 'axios';
import { isoDateToHHMM24, formatDuration } from '../helpers/general';

export const fetchFlights = async (data) => {
  try {    
    const response = await axios.post('/api/v1/search/flight_offers', {
        origin: data.departingIATA,         // e.g., 'LHR'
        destination: data.destinationIATA,    // e.g., 'JFK'
        departureDate: data.departDate,  // e.g., '2024-09-25'
        returnDate: data.returnDate,
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
      
        const itineraryData = filteredFlightOffers.map(offer => ({
          offerId: offer.id,
          price: offer.price.total,
          currency: offer.price.currency,
          itineraries: offer.itineraries.map(itinerary => {
            //Each Segment information
            const segments = itinerary.segments.map(segment => ({
              segmentId: segment.id,
              carrierCode: segment.carrierCode,
              flightNumber: segment.number,
              carrierName: carriers[segment.carrierCode],
              carrierLogo: `https://www.gstatic.com/flights/airline_logos/70px/${segment.carrierCode}.png`,
              departureIata: segment.departure.iataCode,
              departureTime: segment.departure.at,
              arrivalIata: segment.arrival.iataCode,
              arrivalTime: segment.arrival.at,
              flightDuration: formatDuration(segment.duration),
              numberOfStops: segment.numberOfStops,
              aircraft: segment.aircraft.code,
              // operatingCarrier: segment.operating.carrierCode,
            }));
        
            return {
              //Each Itinerary information
              legDuration: formatDuration(itinerary.duration), // Total itinerary duration
              legStops: segments.length - 1, // Number of stops in the itinerary
              legSegments: segments, // Array of all segments in this itinerary
              legDeparting: itinerary.segments[0].departure.iataCode,
              legDepartingTime: itinerary.segments[0].departure.at,
              legArrival: itinerary.segments[segments.length - 1].arrival.iataCode,
              legArrivalTime: itinerary.segments[segments.length -1].arrival.at,
            };
          }),
        }));
      console.log(itineraryData);
      return itineraryData;
    }
    return []; 
    // // Using raw JSON data.
    // if (response.data.data && response.data.data.length > 0) {
    //   const flightOffers = response.data.data;
    //   const carriers = response.data.result.dictionaries.carriers; // Extract carriers from the dictionaries
    //   // console.log(response);
    //   // Map over each flightOffers and add airline names for all segments
    //   const flightOffersWithAirlineNames = flightOffers
    //     .filter(offer => {
    //         // Check if any segment in any itinerary has an invalid carrier code
    //         return offer.itineraries.every(itinerary => 
    //             itinerary.segments.every(segment => 
    //                 !/^6X|7X|8X/.test(segment.carrierCode)
    //                 // !/^6X|7X|8X/.test(segment.operating.carrierCode)
    //             )
    //         );
    //     })
    //     .map(offer => {
    //         const itinerariesWithAirlineNames = offer.itineraries.map(itinerary => {
    //             const segmentsWithAirlineNames = itinerary.segments.map(segment => {
    //                 const airlineCode = segment.carrierCode || 'NA';
    //                 const airlineName = carriers[airlineCode] || "Unknown Airline";
    //                 return { ...segment, airlineName }; // Add airline name
    //             });
    //             return { ...itinerary, segments: segmentsWithAirlineNames }; // Update itinerary with airline names
    //         });
    //         return { ...offer, itineraries: itinerariesWithAirlineNames }; // Update offer with itineraries
    //     });
    //     // console.log(flightOffersWithAirlineNames);
    //   return flightOffersWithAirlineNames;
    // }


  } catch (err) {
    console.error("Error fetching flights:", err);
    throw new Error(err.message);
  }
};
