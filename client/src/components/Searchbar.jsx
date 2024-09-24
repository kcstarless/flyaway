import React, { useState, useCallback, useEffect } from 'react';
import { fetchSuggestions } from './searchbar/fetchSuggestions';
import { fetchFlights } from './searchbar/fetchFlights';
import { debounce } from '../helpers/debounce';
import SearchInput from './searchbar/SearchInput';
import DatePickerInput from './searchbar/DatePickerInput';
import PassengersInput from './searchbar/PassengersInput';
import { useFlightContext } from '../contexts/FlightContext';
import { useLocalizationContext } from '../contexts/LocalizationContext';

const SearchBar = () => {
  const { setFlightData } = useFlightContext();
  const { localizationData } = useLocalizationContext();
  const { currency } = localizationData;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState({ departing: [], destination: [] });
  const [loading, setLoading] = useState({ departing: false, destination: false });
  const [focused, setFocused] = useState({ departing: false, destination: false });
  const [error, setError] = useState(null);

  
  const [formData, setFormData] = useState({
    departingInput: '',
    departingIATA: '',
    destinationInput: '',
    destinationIATA: '',
    departDate: null,
    returnDate: null,
    passengers: 1,
    currencyCode: currency,
  });

  useEffect(() => {
    // Update currencyCode whenever the currency in context changes
    setFormData(prev => ({ ...prev, currencyCode: currency }));
  }, [currency]); // Runs whenever currency changes

  useEffect(() => {
    if (isSubmitted) {
      // Fetch flight data again with updated currency
      const fetchData = async () => {
        try {
          const flights = await fetchFlights({ ...formData, currencyCode: currency });
          setFlightData(flights); // Update flight data with new currency
        } catch (error) {
          setError('Error fetching flights: ' + error.message);
        }
      };
      fetchData();
    }
  }, [currency, isSubmitted]);



  const debouncedFetchSuggestions = useCallback(
    debounce(async (query, type) => {
      setLoading(prev => ({ ...prev, [type]: true }));
      try {
        const results = await fetchSuggestions(query);
        setSuggestions(prev => ({ ...prev, [type]: results }));
      } catch (err) {
        setError(err.message);
        setSuggestions(prev => ({ ...prev, [type]: [] }));
      } finally {
        setLoading(prev => ({ ...prev, [type]: false }));
      }
    }, 300),
    []
  );

  const handleInputChange = (event, type) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [`${type}Input`]: value }));
    debouncedFetchSuggestions(value, type);
  };

  const handleSuggestionClick = (suggestion, type) => {
    const formattedSuggestion = `${suggestion.locationName} (${suggestion.iataCode})`;
    setFormData(prev => ({
      ...prev,
      [`${type}Input`]: formattedSuggestion,
      [`${type}IATA`]: suggestion.iataCode,
    }));
    setSuggestions(prev => ({ ...prev, [type]: [] }));
  };

  const handleFocus = (type) => setFocused(prev => ({ ...prev, [type]: true }));
  const handleBlur = (type) => setTimeout(() => setFocused(prev => ({ ...prev, [type]: false })), 200);

  const validateForm = () => {
    const { departingInput, destinationInput, departDate, passengers } = formData;
    if (!departingInput || !destinationInput || !departDate || !passengers) {
      setError('Please fill out all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    // Fetch flight data using individual parameters
    try {
      const flights = await fetchFlights(formData);
      // console.log('Fetched flight data:', JSON.stringify(flights, null, 2));
      setFlightData(flights); // Store the fetched flights
      setIsSubmitted(true); // Mark the form as submitted
    } catch (error) {
      setError('Error fetching flights: ' + error.message); // Handle errors
    }
  };

  return (
    <div className="search-bar">
    <form className="search-flight" onSubmit={handleSubmit}>
      <SearchInput
        label="From"
        value={formData.departingInput}
        onChange={(event) => handleInputChange(event, 'departing')}
        onFocus={() => handleFocus('departing')}
        onBlur={() => handleBlur('departing')}
        loading={loading.departing}
        suggestions={suggestions.departing}
        onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, 'departing')}
        isFocused={focused.departing}
      />
      <SearchInput
        label="To"
        value={formData.destinationInput}
        onChange={(event) => handleInputChange(event, 'destination')}
        onFocus={() => handleFocus('destination')}
        onBlur={() => handleBlur('destination')}
        loading={loading.destination}
        suggestions={suggestions.destination}
        onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, 'destination')}
        isFocused={focused.destination}
      />
      <DatePickerInput
        label="Depart"
        selectedDate={formData.departDate}
        onChange={(date) => setFormData(prev => ({ ...prev, departDate: date }))} // Update departDate
      />
      <DatePickerInput
        label="Return"
        selectedDate={formData.returnDate}
        onChange={(date) => setFormData(prev => ({ ...prev, returnDate: date }))} // Update returnDate
      />
      <PassengersInput
        passengers={formData.passengers}
        onChange={(event) => setFormData(prev => ({ ...prev, passengers: event.target.value }))} // Update passengers
      />
      {error && <div className="error">Error: {error}</div>}
      <button type="submit" className="submit-button">Search</button>
    </form>
  </div>
  );
};

export default SearchBar;
