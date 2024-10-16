// fetchFlightHistory.js
import { validCurrency } from '../helpers/general';

import axios from "axios";

export const fetchFlightPriceHistory = async(formData) => {
    const currencyValid = validCurrency.includes(formData.currency);
    try {
        !currencyValid && null;
        
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