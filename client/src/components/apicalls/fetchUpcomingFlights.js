import axios from 'axios';

export const upcomingFlights = async (accessToken) => {
    try {
        const response = await axios.get('/api/v1/booking/upcoming_flight', {
            headers: {
              Authorization: `Bearer ${accessToken}`,  // Make sure accessToken is being passed
            }
        });

        if(response) {
            return response
        }
    } catch(err) {
        console.error("Error fetching user's upcoming flights: ", err);
        throw new Error(err.message);
    }
}