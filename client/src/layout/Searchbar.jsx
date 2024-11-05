// Searchbar.jsx

import { useState, useCallback, useEffect } from 'react';
import { fetchSuggestions } from '../components/apicalls/fetchSuggestions';
import { debounce } from '../components/helpers/debounce';
import SearchInput from '../components/searchbar/SearchInput';
import DatePickerInput from '../components/searchbar/DatePickerInput';
import PassengersInput from '../components/searchbar/PassengersInput';
import { useContextFlightOffers } from '../components/contexts/ContextFlightOffers';
import { useContextFlightBooking } from '../components/contexts/ContextFlightBooking';
import { useFlightSearchQuery } from '../components/hooks/useFlightSearchQuery';
import { getDateYYYYMMDD, validateForm } from '../components/helpers/general';
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  // console.count("Searchbar rendered...");
  const { formData, setFormData, resetFlightOffer, isSubmitted, setIsSubmitted } = useContextFlightOffers();
  const { resetFlightBooking } = useContextFlightBooking();
  const [suggestions, setSuggestions] = useState({ departing: [], destination: [] });
  const [loading, setLoading] = useState({ departing: false, destination: false });
  const [focused, setFocused] = useState({ departing: false, destination: false });
  const [isSwapped, setIsSwapped] = useState(false);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate(); 

  // Custom hook to fetch search formData.
  const { refetchAll } = useFlightSearchQuery();

  const onFlightDetailsPage = location.pathname === "/flight_details";
  const onCheckOutPage = location.pathname === "/checkout";
  const onBookingConfirmaitonPage = location.pathname ==="/booking_confirmation"

  // Local component state to manage the inputs without formData
  const [localInputs, setLocalInputs] = useState({
    departingInput: '',
    departingIATA: '',
    destinationInput: '',
    destinationIATA: '',
    departingCityName: '',
    destinationCityName: '',
    departingCountryCode: '',
    destinationCountryCode: '',
    departDate: null,
    returnDate: null,
    departingGeoCode: {},  // Initialize geoCode as an empty object
    destinationGeoCode: {}, // Initialize geoCode as an empty object
  });

  // Switch inputs field data between From and To without re-rendering
  const handleToggle = () => {
    setIsSwapped(prev => !prev);
    setLocalInputs(prev => ({
      ...prev,
      departingInput: prev.destinationInput,
      destinationInput: prev.departingInput,
      departingCityName: prev.destinationCityName,
      destinationCityName: prev.departingCityName,
      departingIATA: prev.destinationIATA,
      destinationIATA: prev.departingIATA,
      departingCountryCode: prev.destinationCountryCode,
      destinationCountryCode: prev.departingCountryCode,
      departingGeoCode: prev.destinationGeoCode,
      destinationGeoCode: prev.departingGeoCode,
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
    // Update local input state for current input value
    setLocalInputs(prev => ({ ...prev, [`${type}Input`]: value }));
    if (value.trim().length > 0) {
      debouncedFetchSuggestions(value, type); // Fetch suggestions based on value
    } else {
      setSuggestions(prev => ({ ...prev, [type]: [] })); // Clear suggestions when input is empty
    }
  };

  // Sets form data with required this field type with additional information for required search
  const handleSuggestionClick = (suggestion, type) => {
    if (!suggestion.noMatch) { // Only if there are suggestions
        const formattedSuggestion = `${suggestion.locationName} (${suggestion.iataCode})`;

        // Attempt to set the localInputs state
        setLocalInputs(({
            ...localInputs,
            [`${type}Input`]: formattedSuggestion,
            [`${type}IATA`]: suggestion.iataCode,
            [`${type}CityName`]: suggestion.cityName || '', // Ensure to fall back to empty string
            [`${type}CountryCode`]: suggestion.countryCode || '', // Ensure to fall back to empty string
            [`${type}GeoCode`]: suggestion.geoCode || '', // Ensure to fall back to empty string
        }));
        console.log(localInputs);
    }
};

  const handleFocus = (type) => setFocused(prev => ({ ...prev, [type]: true }));
  const handleBlur = (type) => setTimeout(() => setFocused(prev => ({ ...prev, [type]: false })), 200);

  const handleSubmit = (event) => {
    event.preventDefault();
    resetFlightBooking();
    resetFlightOffer();

    // Validate form data
    if (validateForm(localInputs, setFormError)) {
      // Update formData with localInputs data
      setFormData(prev => ({
        ...prev,
        ...localInputs
      }));

      setIsSubmitted(true);
    }

  };

  // Listen for changes in formData or isSubmitted
  useEffect(() => {
    if (isSubmitted) {
      // Perform the search after formData is updated
      refetchAll();
      // Redirect to flight_search_result
      navigate("/flight_search_result");
    }
  }, [isSubmitted]);

  return (
    <>
    { onFlightDetailsPage || onCheckOutPage || onBookingConfirmaitonPage 
      ? null 
      : (
      <div className="search-bar">
        <form className="search-flight" onSubmit={handleSubmit}>
          <div className="location-toggle">
            <SearchInput
              label="From"
              value={localInputs.departingInput}
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
              value={localInputs.destinationInput}
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
            selectedDate={localInputs.departDate}
            onChange={(date) => setLocalInputs(prev => ({ ...prev, departDate: getDateYYYYMMDD(date) }))}
          />
          <DatePickerInput
            label="Return"
            selectedDate={localInputs.returnDate}
            onChange={(date) => setLocalInputs(prev => ({ ...prev, returnDate: getDateYYYYMMDD(date) }))}
          />
          <PassengersInput
            passengers={formData.passengers}
            className='passengers'
            onChange={(event) => setFormData(prev => ({ ...prev, passengers: event.target.value }))}
          />
          <button type="submit" className="btn btn--secondary-alt">Search</button>
        </form>
        <p>{formError}</p>
      </div>
      )
    }
    </>
  );
};

export default SearchBar;