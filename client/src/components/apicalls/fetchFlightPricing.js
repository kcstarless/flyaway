import axios from 'axios';

export const fetchFlightPricing = async (selectedOffer) => {
    // console.log("Selected offer passed to fetchFlightPricing:", selectedOffer);
    try {
        const response = await axios.post('/api/v1/search/pricing', {
            offer: selectedOffer.offer
        });
        // console.log(response);
        if (response.data) {
           const currentOffer = response.data;
        //    console.log(currentOffer);
           return currentOffer;
        }
    } catch(err) {
        console.error("Error fetching confirmed flight: ", err);
        throw new Error(err.message);
    }
}

