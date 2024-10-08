// ./searchBar/suggestionHelper.js
import axios from 'axios';
import city_icon from '../../assets/images/icon_city.svg';
import airport_icon from '../../assets/images/icon_airport.svg';
// Persistent cache to store suggestions
const suggestionCache = new Map();

// Define image URLs for airport and city icons
const imageUrls = {
  CITY: city_icon,
  AIRPORT: airport_icon,
};


// Define the function for fetching suggestions
export const fetchSuggestions = async (query) => {
  if (query.length < 2) {
    return []; // Return an empty array if input is too short
  }

  // Check cache first
  if (suggestionCache.has(query)) {
    return suggestionCache.get(query);
  }

  try {
    const response = await axios.get(`/api/v1/search/airport_city`, {
      params: { location: query }
    });
    // console.log(response.data);
    if (response.data.data) {
      const filteredSuggestions = response.data.data.map((location) => ({
        subType: location.subType,
        cityName: location.address.cityName,
        cityCode: location.address.cityCode,
        locationName: location.name,
        iataCode: location.iataCode,
        country: location.address.countryName,
        countryCode: location.address.countryCode,
        redgionCode: location.address.regionCode,
        geoCode: location.geoCode,
        imageUrl: imageUrls[location.subType],
      }));
      console.log(filteredSuggestions);
      const limitedSuggestions = filteredSuggestions.slice(0, 10);
      suggestionCache.set(query, limitedSuggestions); // Cache the results

      return limitedSuggestions;
    } else {
      console.log("No Data Found");
      return [];
    }
  } catch (err) {
    throw new Error(err.message);
  }
};
