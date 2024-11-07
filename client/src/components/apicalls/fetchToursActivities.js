import axios from "axios"

const cachedData = localStorage.getItem('tours_activities');

export const fetchToursActivities = async (geoLocation) => {
    const latitude = geoLocation.latitude;
    const longitude = geoLocation.longitude;

    if (cachedData) {
        console.log("Using cached data");
        return JSON.parse(cachedData); // Return cached data if available
    }

    try {
        console.log("Fetching tours and activities");
        const response = await axios.get(`/api/v1/search/tours_activities`, {
            params: {
                latitude: latitude,
                longitude: longitude,
                radius: 50,
            }
        });
        if (response.status === 200) {
            localStorage.setItem('tours_activities', JSON.stringify(response.data.data));
            return response.data.data
        }
    } catch (error) {
        console.log(error);
    }
}