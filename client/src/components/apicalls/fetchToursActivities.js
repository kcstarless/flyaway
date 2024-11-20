import axios from "axios"
import { getLocalstorageItem, setLocalstorageItem } from "../helpers/localstorage"

export const fetchToursActivities = async (geoLocation) => {
    const latitude = geoLocation.latitude;
    const longitude = geoLocation.longitude;

    // if (getLocalstorageItem('toursActivities')) {
    //     return getLocalstorageItem('toursActivities');
    // }

    try {
        console.log("Fetching tours and activities");
        const response = await axios.get(`/api/v1/search/tours_activities`, {
            params: {
                latitude: latitude,
                longitude: longitude,
                radius: 50,
            }
        });

        console.log("Tours and activities response:", response);
        if (response.status === 200) {
            setLocalstorageItem('toursActivities', response.data.data);
            return response.data.data
        }
    } catch (error) {
        console.log(error);
    }
}