import React, { useState } from 'react';
import { fetchSuggestions } from '../helpers/suggestionHelper'; // Adjust the import path as necessary

const suggestionCache = new Map(); // Persistent cache

const SearchBar = () => {
  const [departingInput, setDepartingInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [departingSuggestions, setDepartingSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [error, setError] = useState(null);

  // Define the function for handling input change
  const handleChange = async (event) => {
    const { name, value } = event.target;

    // Update the appropriate input state
    if (name === 'departing') {
      setDepartingInput(value);
      await fetchAndSetSuggestions(value, setDepartingSuggestions);
    } else if (name === 'destination') {
      setDestinationInput(value);
      await fetchAndSetSuggestions(value, setDestinationSuggestions);
    }
  };

  // Fetch suggestions and handle caching
  const fetchAndSetSuggestions = async (query, setSuggestions) => {
    // Check cache first
    if (suggestionCache.has(query)) {
      setSuggestions(suggestionCache.get(query));
      return;
    }

    try {
      const results = await fetchSuggestions(query);
      setSuggestions(results);
      suggestionCache.set(query, results); // Cache the results
    } catch (err) {
      setError(err.message);
      setSuggestions([]); // Clear suggestions on error
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion, type) => {
    if (type === 'departing') {
      setDepartingInput(suggestion.locationName);
      setDepartingSuggestions([]); // Clear suggestions
    } else if (type === 'destination') {
      setDestinationInput(suggestion.locationName);
      setDestinationSuggestions([]); // Clear suggestions
    }
  };

  return (
    <div className="search-flight">
      <h2>Search for Cities and Airports</h2>
      <div className="input-group">
        <input
          className="departing-input"
          type="text"
          name="departing"
          value={departingInput}
          onChange={handleChange}
          placeholder="Departing city..."
        />
        {departingSuggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {departingSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion, 'departing')}
              >
                <strong>{suggestion.locationName}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="input-group">
        <input
          className="destination-input"
          type="text"
          name="destination"
          value={destinationInput}
          onChange={handleChange}
          placeholder="Destination city..."
        />
        {destinationSuggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {destinationSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion, 'destination')}
              >
                <strong>{suggestion.locationName}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <div className="error">Error: {error}</div>}
    </div>
  );
};

export default SearchBar;
