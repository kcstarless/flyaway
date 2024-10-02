import React, { useState, useCallback, useEffect } from 'react';
import { fetchSuggestions } from './apicalls/fetchSuggestions';
import { fetchFlights } from './apicalls/fetchFlights';
import { debounce } from './helpers/debounce';
import SearchInput from './searchbar/SearchInput';
import DatePickerInput from './searchbar/DatePickerInput';
import PassengersInput from './searchbar/PassengersInput';
import { useFlightOffersContext } from './contexts/FlightOffersContext';
import { useLocalizationContext } from './contexts/LocalizationContext';
import { useQuery, useQueries } from '@tanstack/react-query';

const SearchBar = () => {
  const { setFlightOffersData } = useFlightOffersContext();
  const { localizationData } = useLocalizationContext();
  const { currency } = localizationData;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currencyChanged, setCurrencyChanged] = useState(false); // New state for currency change
  const [formData, setFormData] = useState({
    departingInput: '',
    departingIATA: '',
    departingCityName: '',
    departingCountryCode: '',
    destinationInput: '',
    destinationIATA: '',
    destinationCityName: '',
    destinationCountryCode: '',
    departDate: null,
    returnDate: null,
    passengers: 1,
    currencyCode: currency, // Initialize with current currency
  });

  const [suggestions, setSuggestions] = useState({ departing: [], destination: [] });
  const [loading, setLoading] = useState({ departing: false, destination: false });
  const [focused, setFocused] = useState({ departing: false, destination: false });
  const [error, setError] = useState(null);
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    // Update currency in formData when currency changes
    setFormData(prev => ({ ...prev, currencyCode: currency }));
    setCurrencyChanged(true); // Mark that currency has changed
  }, [currency]);

  const handleToggle = () => {
    setIsSwapped(prev => !prev);
    setFormData(prev => ({
      ...prev,
      departingInput: prev.destinationInput,
      destinationInput: prev.departingInput,
      departingIATA: prev.destinationIATA,
      destinationIATA: prev.departingIATA,
    }));
  };

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
    }, 500),
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
      [`${type}CityName`]: suggestion.cityName,
      [`${type}CountryCode`]: suggestion.countryCode,
    }));
  };

  const handleFocus = (type) => setFocused(prev => ({ ...prev, [type]: true }));
  const handleBlur = (type) => setTimeout(() => setFocused(prev => ({ ...prev, [type]: false })), 200);

  const validateForm = () => {
    const { departingIATA, destinationInput, departDate, passengers } = formData;
    if (!departingIATA || !destinationInput || !departDate || !passengers) {
      setError('Please fill out all required fields.');
      return false;
    }
    return true;
  };

  // UseQuery to fetch flight offers based on form data and currency
  // const { data: queryOffers, isLoading, error: queryError, refetch } = useQuery({
  const queryOffers = useQuery ({
    queryKey: ['queryFlightOffers', formData], // Cache key includes formData, which includes currency
    queryFn: () => fetchFlights(formData), // Query function
    enabled: isSubmitted && currencyChanged && formData.departingIATA && !!formData.destinationIATA, // Re-fetch if form has been submitted, currency has changed, and valid IATA codes exist
  });

  if (queryOffers.isSuccess) {
    console.log("Offers fetched");
  }
  // UseQuery to fetch destination offers.
  // const { data: activtiesOffers, isLoading, error: queryError }

  useEffect(() => {
    if (queryOffers.data) {
      setFlightOffersData(queryOffers.data); // Set the fetched flight offers
    }
  }, [queryOffers.data, setFlightOffersData]);

  useEffect(() => {
    if (queryOffers.error) {
      setError('Error fetching flights: ' + queryOffers.error.message); // Handle errors
    }
  }, [queryOffers.error]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitted(true); // Set form as submitted
    setCurrencyChanged(false); // Reset currency changed after submission
    queryOffers.refetch(); // Trigger fetching of flights manually
  };

  return (
    <div className="search-bar">
      <form className="search-flight" onSubmit={handleSubmit}>
        <div className="location-toggle">
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
            className='departing'
          />
          <button type="button" className="toggle-button" onClick={handleToggle}>
            <span className={`arrow ${isSwapped ? 'flipped' : ''}`}>&#8596;</span>
          </button>
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
            className='destination'
          />
        </div>
        <DatePickerInput
          label="Depart"
          selectedDate={formData.departDate}
          onChange={(date) => setFormData(prev => ({ ...prev, departDate: date }))}
        />
        <DatePickerInput
          label="Return"
          selectedDate={formData.returnDate}
          onChange={(date) => setFormData(prev => ({ ...prev, returnDate: date }))}
        />
        <PassengersInput
          passengers={formData.passengers}
          className='passengers'
          onChange={(event) => setFormData(prev => ({ ...prev, passengers: event.target.value }))}
        />
        <button type="submit" className="btn btn--secondary">Search</button>
      </form>
      {queryOffers.isLoading && <div>Loading flight offers...</div>}
      {queryOffers.queryError && <div>Query Error: {error}</div>}
      {error && <div>Form Error: {error} </div>}
    </div>
  );
};

export default SearchBar;
