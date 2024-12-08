// ./searchBar/suggestionHelper.js
import axios from 'axios';
import city_icon from '../../assets/images/icon_city.svg';
import airport_icon from '../../assets/images/icon_airport.svg';
// Persistent cache to store suggestions
const suggestionCache = new Map();

// Icons for CITY and AIRPORT subTypes
const imageUrls = {
  CITY: city_icon,
  AIRPORT: airport_icon,
};

// Fetch location suggestion
export const fetchSuggestions = async (location) => {
  if (location.length < 2) {
    return []; // Return an empty array if input is too short
  }

  // Check cache first
  // if (suggestionCache.has(location)) {
  //   return suggestionCache.get(location);
  // }

  const noMatchedSuggestion = { cityName: "No match found", noMatch: true };

  try {
    // console.log("Fetching suggestions for:", location);
    const response = await axios.get(`/api/v1/search/airport_city`, {
      params: { location: location }
    });

    if (response.data.data && response.data.data.length > 0) {
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
        noMatch: false,
      }));
      // console.log(filteredSuggestions);
      const limitedSuggestions = filteredSuggestions.slice(0, 10);
      suggestionCache.set(location, limitedSuggestions); // Cache the results

      return limitedSuggestions;
    } else {
      console.log("No match found");
      return [noMatchedSuggestion];
    }
  } catch (err) {
    console.log(err)
    throw new Error(`Fetch Suggestion Error: ${err.message}`);
  }
};
