import React from 'react';
import SuggestionsList from './SuggestionsList';

const SearchInput = ({ label, value, onChange, onFocus, onBlur, loading, suggestions, onSuggestionClick, isFocused }) => (
  <div className="search-item">
    <div className="input-wrapper">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Country, city or airport"
        autoComplete="off"
      />
      {loading && <div className="loading-spinner"></div>}
    </div>
    <SuggestionsList
      suggestions={suggestions}
      isFocused={isFocused}
      onSuggestionClick={onSuggestionClick}
    />
  </div>
);

export default SearchInput;
