// fetchFlightHistory.js
import axios from "axios";

export const fetchFlightPriceHistory = async(formData, isReturn) => {
    try {
        const response = await axios.get(`api/v1/search/flight_history`, {
            params: { 
                originIataCode: formData.departingIATA,
                destinationIataCode: formData.destinationIATA,
                departureDate: formData.departDate,
                currencyCode: formData.currencyCode
            }
        });
        // console.log(response.data.data[0].priceMetrics);
        if (response.data.data[0].priceMetrics.length > 0) {
            return response.data.data[0].priceMetrics;
        } else {
            return [];
        }
    } catch (err) {
        throw new Error(err.message)
    }
}