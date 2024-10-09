import { useState, useCallback, useEffect } from 'react';
import { fetchSuggestions } from './apicalls/fetchSuggestions';
import { debounce } from './helpers/debounce';
import SearchInput from './searchbar/SearchInput';
import DatePickerInput from './searchbar/DatePickerInput';
import PassengersInput from './searchbar/PassengersInput';
import { useLocalizationContext } from './contexts/LocalizationContext';
import { useFlightSearchQuery } from './hooks/useFlightSearchQuery';
import { getDateYYYYMMDD, validateForm } from './helpers/general';

const SearchBar = () => {
  const { localizationData } = useLocalizationContext();
  const { currency } = localizationData;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currencyChanged, setCurrencyChanged] = useState(false);
  const [suggestions, setSuggestions] = useState({ departing: [], destination: [] });
  const [loading, setLoading] = useState({ departing: false, destination: false });
  const [focused, setFocused] = useState({ departing: false, destination: false });
  const [isSwapped, setIsSwapped] = useState(false);
  const [formError, setFormError] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    departingInput: '',
    departingIATA: '',
    departingCityName: '',
    departingCountryCode: '',
    destinationInput: '',
    destinationIATA: '',
    destinationCityName: '',
    destinationCountryCode: '',
    destinationGeoCode: '',
    departDate: null,
    returnDate: null,
    passengers: 1,
    currencyCode: currency, // Initialize with current currency
  });

  // Custom Hooks
  const { refetchAll } = useFlightSearchQuery(formData, isSubmitted, currencyChanged)

  // Updates form currency properties
  useEffect(() => {
    setFormData(prev => ({ ...prev, currencyCode: currency }));
    setCurrencyChanged(true); // Mark that currency has changed
  }, [currency]);

  // Switch inputs field data between From and To. 
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

  // Debounce for location search
  const debouncedFetchSuggestions = useCallback(
    debounce(async (query, type) => {
      setLoading(prev => ({ ...prev, [type]: true }));
      try {
        const results = await fetchSuggestions(query);
        setSuggestions(prev => ({ ...prev, [type]: results }));
      } catch (err) {
        console.log(err.message);
        setSuggestions(prev => ({ ...prev, [type]: [] }));
      } finally {
        setLoading(prev => ({ ...prev, [type]: false }));
      }
    }, 500),
    []
  );

  const handleInputChange = (event, type) => {
    const value = event.target.value;
    // Update the form data with the current input value
    setFormData(prev => ({ ...prev, [`${type}Input`]: value }));
    // fetch only if there is at least one character
    if (value.trim().length > 0) {
      debouncedFetchSuggestions(value, type); // Search location for change value
    } else {
      // Optionally reset suggestions if the input is empty
      setSuggestions(prev => ({ ...prev, [type]: [] })); // Clear suggestions when input is empty
    }
  };

  // Sets form data with required this field type with additional information for required search
  const handleSuggestionClick = (suggestion, type) => {
    if (!suggestion.noMatch) {  // Only if there is suggestions
      const formattedSuggestion = `${suggestion.locationName} (${suggestion.iataCode})`;
      setFormData(prev => ({
        ...prev,
        [`${type}Input`]: formattedSuggestion, // Displays on input field
        [`${type}IATA`]: suggestion.iataCode,
        [`${type}CityName`]: suggestion.cityName,
        [`${type}CountryCode`]: suggestion.countryCode,
        [`${type}GeoCode`]: suggestion.geoCode,
      }));
    };
    // if (formData.departingIATA === formData.destinationIATA) {
    //   setFormError("Origin and destination can't be same.");
    // }
  };

  const handleFocus = (type) => setFocused(prev => ({ ...prev, [type]: true }));
  const handleBlur = (type) => setTimeout(() => setFocused(prev => ({ ...prev, [type]: false })), 200);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm(formData, setFormError)) return;

    setIsSubmitted(true); // Set form as submitted
    setCurrencyChanged(false); // Reset currency changed after submission

    refetchAll();
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
          onChange={(date) => setFormData(prev => ({ ...prev, departDate: getDateYYYYMMDD(date) }))}
        />
        <DatePickerInput
          label="Return"
          selectedDate={formData.returnDate}
          onChange={(date) => setFormData(prev => ({ ...prev, returnDate: getDateYYYYMMDD(date) }))}
        />
        <PassengersInput
          passengers={formData.passengers}
          className='passengers'
          onChange={(event) => setFormData(prev => ({ ...prev, passengers: event.target.value }))}
        />
        <button type="submit" className="btn btn--secondary">Search</button>
      </form>
      <p>{formError}</p>
    </div>
  );
};

export default SearchBar;