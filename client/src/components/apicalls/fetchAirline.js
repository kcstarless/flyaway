// fetchAirline.js

import axios from "axios";

export const fetchAirline = async (code) => {
    try {
        const response = await axios.get(`/api/v1/search/airline`, { params: { airlineCodes: code}});

        if (response.data.data) {
            console.log(response.data.data[0].businessName);
            return response.data.data[0].businessName;
        }
        
    } catch (err) {
        throw new Error(err.message);
    }
};

