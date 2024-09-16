import React, { useState, useCallback } from 'react';
import { fetchSuggestions } from '../helpers/suggestionHelper'; // Adjust the import path as necessary
import { debounce } from '../helpers/utilHelpers'; // Debounce helper
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SearchBar = () => {
  const [departingInput, setDepartingInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [departingSuggestions, setDepartingSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [departLoading, setDepartLoading] = useState(false);
  const [destLoading, setDestLoading] = useState(false);
  const [isDepartingFocused, setIsDepartingFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [departDate, setDepartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  // Debounced fetch function
  const debouncedFetchSuggestions = useCallback(
    debounce(async (query, type, setSuggestions) => {
      setLoadingState[type]?.();
      try {
        const results = await fetchSuggestions(query);
        setSuggestions(results);
      } catch (err) {
        setError(err.message);
        setSuggestions([]);
      } finally {
        setDepartLoading(false);
        setDestLoading(false);
      }
    }, 300),
    []
  );

  // Set loading state
  const setLoadingState = {
    departing: () => setDepartLoading(true),
    destination: () => setDestLoading(true),
  };

  // Handle input focus
  const handleFocus = (type) => {
    if (type === 'departing') {
      setIsDepartingFocused(true);
    } else if (type === 'destination') {
      setIsDestinationFocused(true);
    }
  };

  // Handle input blur
  const handleBlur = (type) => {
    if (type === 'departing') {
      setTimeout(() => setIsDepartingFocused(false), 50); // Delay to allow click
    } else if (type === 'destination') {
      setTimeout(() => setIsDestinationFocused(false), 50);
    }
  };
  // Handle input change
  const handleInputChange = (event, value, type) => {
    if (type === 'departing') {
      setDepartingInput(value);
      debouncedFetchSuggestions(value, type, setDepartingSuggestions);
    } else if (type === 'destination') {
      setDestinationInput(value);
      debouncedFetchSuggestions(value, type, setDestinationSuggestions);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion, type) => {
    console.log(`Suggestion clicked: ${suggestion}, Type: ${type}`); 
    if (type === 'departing') {
      setDepartingInput(suggestion);
      setDepartingSuggestions([]); // Close dropdown after selection
    } else if (type === 'destination') {
      setDestinationInput(suggestion);
      setDestinationSuggestions([]); // Close dropdown after selection
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Gather form data
    const formData = {
      departing: departingInput,
      destination: destinationInput,
      departDate: departDate,
      returnDate: returnDate,
    };
    console.log('Form submitted with data:', formData);
    // You can now send this data to your backend or perform other actions
  };

  return (
    <form className="search-flight" onSubmit={handleSubmit}>
      <div className="search-item">
        <div className="input-wrapper">
          <label>From</label>
          <input
            type="text"
            value={departingInput}
            onChange={(event) => handleInputChange(event, event.target.value, 'departing')}
            onFocus={() => handleFocus('departing')}
            onBlur={() => handleBlur('departing')}
            placeholder="Country, city or airport"
            autoComplete="off"
          />
          {departLoading && <div className="loading-spinner"></div>}
        </div>

        {/* Render suggestions dropdown */}
        {(departingSuggestions.length > 0 && isDepartingFocused) && (
          <ul className="suggestions-list">
            {departingSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion.locationName, 'departing')}
              >
              <img src={suggestion.imageUrl} alt="icon" className='type-icon' />
              <div>
                <p className="p-medium">{suggestion.cityName} {suggestion.subType === 'AIRPORT' && suggestion.locationName} ({suggestion.iataCode})</p>
                <p className="p-small">{suggestion.country}</p>
              </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="search-item">
        <div className="input-wrapper">
          <label>To</label>
          <input
            type="text"
            value={destinationInput}
            onChange={(event) => handleInputChange(event, event.target.value, 'destination')}
            onFocus={() => handleFocus('destination')}
            onBlur={() => handleBlur('destination')}
            placeholder="Country, city or airport"
            autoComplete="off"
          />
          {destLoading && <div className="loading-spinner"></div>}
        </div>
        {/* Render suggestions dropdown */}
        {(destinationSuggestions.length > 0 && isDestinationFocused) && (
          <ul className="suggestions-list">
            {destinationSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion.locationName, 'destination')}
              >
              <img src={suggestion.imageUrl} alt="icon" className='type-icon' />
              <div>
                <p className="p-medium">{suggestion.cityName} {suggestion.subType === 'AIRPORT' && suggestion.locationName} ({suggestion.iataCode})</p>
                <p className="p-small">{suggestion.country}</p>
              </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="search-item">
        <label>Depart</label><br />
        <DatePicker
          selected={departDate}
          onChange={(date) => setDepartDate(date)}
          placeholderText='Add Date'
        />
      </div>

      <div className="search-item">
        <label>Return</label><br />
        <DatePicker
          selected={returnDate}
          onChange={(date) => setReturnDate(date)}
          placeholderText='Add Date'
        />
      </div>
      {error && <div className="error">Error: {error}</div>}

      <button type="submit" className="submit-button">Search</button>
    </form>
  );
};

export default SearchBar;
