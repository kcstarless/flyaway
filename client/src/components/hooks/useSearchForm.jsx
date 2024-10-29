// components/hooks/useSearchForm.jsx

import { useState, useCallback } from 'react';
import { debounce } from '../helpers/debounce';
import { fetchSuggestions } from '../apicalls/fetchSuggestions';

export const useSearchForm = (initialFormData, currency) => {
  const [formData, setFormData] = useState({ ...initialFormData, currencyCode: currency });
  const [suggestions, setSuggestions] = useState({ departing: [], destination: [] });
  const [loading, setLoading] = useState({ departing: false, destination: false });
  const [focused, setFocused] = useState({ departing: false, destination: false });

  // Debounce search suggestions
  const debouncedFetchSuggestions = useCallback(
    debounce(async (query, type) => {
      setLoading((prev) => ({ ...prev, [type]: true }));
      try {
        const results = await fetchSuggestions(query);
        setSuggestions((prev) => ({ ...prev, [type]: results }));
      } catch (err) {
        setSuggestions((prev) => ({ ...prev, [type]: [] }));
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }));
      }
    }, 500),
    []
  );

  const handleInputChange = (event, type) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [`${type}Input`]: value }));

    if (value.trim().length > 0) {
      debouncedFetchSuggestions(value, type);
    } else {
      setSuggestions((prev) => ({ ...prev, [type]: [] }));
    }
  };

  const handleSuggestionClick = (suggestion, type) => {
    if (!suggestion.noMatch) {
      setFormData((prev) => ({
        ...prev,
        [`${type}Input`]: `${suggestion.locationName} (${suggestion.iataCode})`,
        [`${type}IATA`]: suggestion.iataCode,
      }));
    }
  };

  const handleFocus = (type) => setFocused((prev) => ({ ...prev, [type]: true }));
  const handleBlur = (type) => setTimeout(() => setFocused((prev) => ({ ...prev, [type]: false })), 200);

  return {
    formData,
    setFormData,
    suggestions,
    loading,
    focused,
    handleInputChange,
    handleSuggestionClick,
    handleFocus,
    handleBlur,
  };
};
