// fetchFlight.js
import axios from 'axios';

export const fetchFlights = async (data) => {
  try {
    // Format dates as yyyy-mm-dd
    const formattedDepartDate = data.departDate ? data.departDate.toISOString().slice(0, 10) : null;
    const formattedReturnDate = data.returnDate ? data.returnDate.toISOString().slice(0, 10) : null;
    
    const response = await axios.post('/api/v1/search/flight_offers', {
        origin: data.departingIATA,         // e.g., 'LHR'
        destination: data.destinationIATA,    // e.g., 'JFK'
        departureDate: formattedDepartDate,  // e.g., '2024-09-25'
        adults: data.passengers,         // e.g., 1
        currencyCode: data.currencyCode,      // e.g., 'USD'
    });

    // console.log(response.data);

    function formatDateTime(dateTime) {
      const date = new Date(dateTime);
      const options = { hour: 'numeric', minute: 'numeric', hour12: false };
      return date.toLocaleString('en-US', options);
    }

    function formatDuration(duration) {
      const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
      const matches = duration.match(regex);
      const hours = matches[1] ? parseInt(matches[1], 10) : 0;
      const minutes = matches[2] ? parseInt(matches[2], 10) : 0;

      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`; // Format HH:MM
      return [formattedTime, hours * 60 + minutes]; // Total minutes
    }

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
            departureTime: formatDateTime(itinerary.segments[0].departure.at),
            duration: formatDuration(itinerary.duration),
            arrivalIata: itinerary.segments[lastSegment].arrival.iataCode,
            arrivalTime: formatDateTime(itinerary.segments[lastSegment].arrival.at),
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
    throw new Error(err.message);
  }
};
