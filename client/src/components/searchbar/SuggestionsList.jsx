// searchBar/SuggestionsList.jsx

const SuggestionsList = ({ suggestions, isFocused, onSuggestionClick }) => {
  if (!isFocused || suggestions.length === 0) return null;

  return (
    <ul className="suggestions-list">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          className="suggestion-item"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion.noMatch ? (
            <div>
              <p className="p-medium">{suggestion.cityName}</p>
            </div>
          ) : (
            <>
            <img src={suggestion.imageUrl} alt="icon" className='type-icon' />
            <div>
              <p className="p-medium">{suggestion.cityName} {suggestion.subType === 'AIRPORT' && suggestion.locationName} ({suggestion.iataCode})</p>
              <p className="p-small">{suggestion.country}</p>
            </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsList;
