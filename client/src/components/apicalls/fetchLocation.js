// fetchLocation.js

import axios from 'axios';

export const fetchLocation = async (iataCode) => {
    try {
        const response = await axios.get(`/api/v1/search/airport_iata/${iataCode}`);
        const details = response.data.details; // Use response.data to access the details
        // console.log(details);

        if (details) {

            return {
                cityName: details.position.region.city, // Access the city name
                locationName: details.name,              // Access the airport name
                subType: details.code.icao,              // Assuming you want the ICAO code as subType
                iata: details.code.iata,                 // Access the IATA code
                latitude: details.position.latitude,     // Add latitude if needed
                longitude: details.position.longitude,   // Add longitude if needed
                country: details.position.country.name,  // Country name
                website: details.website,                 // Airport website
                timezone: details.timezone.name          // Timezone name
            }
        }    
        return {};
    } catch (err) {
        console.log(err);
        throw new Error(`Fetch Location Error: ${err.message}`);
    }
};
