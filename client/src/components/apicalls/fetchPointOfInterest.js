// fetchPointOfInterest.js

import axios from "axios"

export const fetchPoI = async (formData) => {
    // console.log(formData.destinationGeoCode.latitude);
    // console.log(formData.destinationGeoCode.longitude);
    const response = await axios.post('/api/v1/search/poi_offers', {
        latitude: formData.destinationGeoCode.latitude,
        longitude: formData.destinationGeoCode.longitude,
        radius: 1,
    });
    // console.log(response);
    return response.data
}