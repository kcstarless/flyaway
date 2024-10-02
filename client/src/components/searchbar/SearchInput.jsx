// SearchInput.jsx

import React from 'react';
import SuggestionsList from './SuggestionsList';

const SearchInput = ({ label, value, onChange, onFocus, onBlur, loading, suggestions, onSuggestionClick, isFocused, className }) => (
  <div className={`search-item search-item--${className}`}>
    <div className={`input-wrapper-${className}`}>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Country, city or airport"
        className={`input-${className}`}
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
