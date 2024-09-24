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
    // Log the response for debugging
    console.log('API Response:', response.data);
    return response.data.data;
  } catch (err) {
    throw new Error(err.message);
  }
};
