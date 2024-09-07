// src/helpers/suggestionHelper.js
import axios from 'axios';

// Define the function for fetching suggestions
export const fetchSuggestions = async (query) => {
  if (query.length < 2) {
    return []; // Return an empty array if input is too short
  }

  try {
    const response = await axios.get(`/api/v1/search/airport_city`, {
      params: { location: query }
    });

    if (response.data.data) {
      const filteredSuggestions = response.data.data.map(location => ({
        locationName: location.detailedName
      }));

      // Limit the number of suggestions to a maximum of 5
      return filteredSuggestions.slice(0, 5);
    } else {
        console.log("No Data Found")
        return [];
    }
  } catch (err) {
    throw new Error(err.message);
  }
};