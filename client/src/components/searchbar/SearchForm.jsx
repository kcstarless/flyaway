import DatePickerInput from './DatePickerInput';
import PassengersInput from './PassengersInput';
import { fetchSuggestions } from '../apicalls/fetchSuggestions';
import { debounce } from '../helpers/debounce';
import { getDateYYYYMMDD, validateForm } from '../helpers/general';
import SuggestionsList from '../searchbar/SuggestionsList';
import { useState, useCallback, useEffect } from 'react';

const SearchForm = ({ handleSubmit, localInputs, setLocalInputs}) => {
    const [suggestions, setSuggestions] = useState({ departing: [], destination: [] });
    const [loading, setLoading] = useState({ departing: false, destination: false });
    const [focused, setFocused] = useState({ departing: false, destination: false });
    const [isSwapped, setIsSwapped] = useState(false);
    const [formError, setFormError] = useState('');

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

    const handleFormSubmit = (event) => {
      event.preventDefault();
      // if (validateForm(localInputs, setFormError)) {
      //   handleSubmit();
      // }
      handleSubmit();
    };
    const validateForm = (input, setFormError) => {
      const { departingIATA, destinationIATA, departDate, passengers } = input;
      
      if (!departingIATA || !destinationIATA || !departDate || !passengers) {
        
        setFormError('Please fill out all required fields and must select from dropdown list.');
        return false;
      }
      if (departingIATA === destinationIATA) {
        setFormError("Origin and destination can not be same.");
        return false;
      }
      setFormError('');
      return true;
    }

    const handleFocus = (type) => setFocused(prev => ({ ...prev, [type]: true }));
    const handleBlur = (type) => setTimeout(() => setFocused(prev => ({ ...prev, [type]: false })), 200);
    
    return (
      <>
        <form className="search-flight" onSubmit={handleFormSubmit}>

          <div className="location-toggle">
            <div className={`search-item search-item--departing`}>
              <div className={!formError ? `input-wrapper-departing` : `input-wrapper-departing error`}>
                <label>From</label>
                <input
                  type="text"
                  value={localInputs.departingInput}
                  onChange={(event) => handleInputChange(event, 'departing')}
                  onFocus={() => handleFocus('departing')}
                  onBlur={() => handleBlur('departing')}
                  placeholder="Country, city or airport"
                  className={`input-departing`}
                  autoComplete="off"
                />
                {loading.departing && <div className="loading-spinner"></div>}
              </div>
              <SuggestionsList
                suggestions={suggestions.departing}
                isFocused={focused.departing}
                onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, 'departing')}
              />
            </div>
            <button type="button" className="toggle-button" onClick={handleToggle}>
              <span className={`arrow ${isSwapped ? 'flipped' : ''}`}>&#8596;</span>
            </button>
            <div className={`search-item search-item--destination`}>
              <div className={!formError ? `input-wrapper-destination` : `input-wrapper-destination error`}>
                <label>To</label>
                <input
                  type="text"
                  value={localInputs.destinationInput}
                  onChange={(event) => handleInputChange(event, 'destination')}
                  onFocus={() => handleFocus('destination')}
                  onBlur={() => handleBlur('destination')}
                  placeholder= "Country, city or airport"  
                  className={`input-destination`}
                  autoComplete="off"
                />
                {loading.destination && <div className="loading-spinner"></div>}
              </div>
              <SuggestionsList
                suggestions={suggestions.destination}
                isFocused={focused.destination} 
                onSuggestionClick={(suggestion) => handleSuggestionClick(suggestion, 'destination')}
              />
            </div>
          </div>
          
          <DatePickerInput
            label="Depart"
            error={formError}
            selectedDate={localInputs.departDate}
            onChange={(date) => setLocalInputs(prev => ({ ...prev, departDate: getDateYYYYMMDD(date) }))}
          />
          <DatePickerInput
            label="Return"
            selectedDate={localInputs.returnDate}
            onChange={(date) => setLocalInputs(prev => ({ ...prev, returnDate: getDateYYYYMMDD(date) }))}
          />
          <PassengersInput
            passengers={localInputs.passengers}
            className='passengers'
            onChange={(event) => setLocalInputs(prev => ({ ...prev, passengers: event.target.value }))}
          />
          <button type="submit" className="btn btn--secondary-alt">Search</button>
          {formError && <><div className="form-error">{formError}</div></>}
        </form>
        
        </>
    )
}

export default SearchForm;