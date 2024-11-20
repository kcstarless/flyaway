import axios from 'axios';

export const fetchCreateFlightBooking = async (offer, travelers) => {
    // console.log(travelers);
    try {
        const response = await axios.post('/api/v1/booking/book_flight', {
            offer: offer,
            travelers: travelers,
        })
        // console.log(response);
        if(response.data) {
            const booking = response.data;
            return booking;
        }
    } catch(err) {
        console.error("Error fetching confirmed flight: ", err);
        throw new Error(err.message);
    }
}