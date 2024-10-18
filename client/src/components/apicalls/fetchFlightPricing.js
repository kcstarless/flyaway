import axios from 'axios';

export const fetchFlightPricing = async (selectedOffer) => {
    try {
        const response = await axios.post('/api/v1/search/pricing', {
            offer: selectedOffer
        });

        if (response.data) {
           const currentOffer = response.data;
           console.log(currentOffer);
           return currentOffer;
        }
    } catch(err) {
        console.error("Error fetching confirmed flight: ", err);
        throw new Error(err.message);
    }
}

