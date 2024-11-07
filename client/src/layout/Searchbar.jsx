// Searchbar.jsx
import SearchForm from '../components/searchbar/SearchForm';
import { useState, useCallback, useEffect } from 'react';
import { useContextFlightOffers } from '../components/contexts/ContextFlightOffers';
import { useContextFlightBooking } from '../components/contexts/ContextFlightBooking';
import { useFlightSearchQuery } from '../components/hooks/useFlightSearchQuery';
import { validateForm, timeout } from '../components/helpers/general';
import { useNavigate } from "react-router-dom";
import { LoaderPlane }  from '../components/helpers/Loader';

const SearchBar = () => {
  // console.count("Searchbar rendered...");
  const { setFormData, resetFlightOffer, isSubmitted, setIsSubmitted } = useContextFlightOffers();
  const { resetFlightBooking } = useContextFlightBooking();
  const [formError, setFormError] = useState('');
  const navigate = useNavigate(); 

  // Custom hook to fetch search formData.
  const { refetchAll, queryResults } = useFlightSearchQuery();

  const [outboundFlight, flightPriceHistory] = queryResults;

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
    passengers: 1,
    departDate: null,
    returnDate: null,
    departingGeoCode: {},  // Initialize geoCode as an empty object
    destinationGeoCode: {}, // Initialize geoCode as an empty object
  });


  const handleSubmit = (event) => {
    event.preventDefault();

     // Validate form data
    if (validateForm(localInputs, setFormError)) {
      resetFlightBooking();
      resetFlightOffer();
      // Update formData with localInputs data
      setFormData(prev => ({
        ...prev,
        ...localInputs
      }));
      refetchAll();
      setIsSubmitted(true);
    }
    if (isSubmitted) {
      timeout(3000);
    }
  };

  // Listen for changes in formData or isSubmitted
  useEffect(() => {
    if (isSubmitted && outboundFlight.isFetched && flightPriceHistory.isFetched) {
      // Perform the search after formData is updated
      setIsSubmitted(false);
      navigate("/flight_search_result");
    } 
  }, [isSubmitted, outboundFlight.isFetched, flightPriceHistory.isFetched]);

  return (
    <>
    { onFlightDetailsPage || onCheckOutPage || onBookingConfirmaitonPage 
      ? null 
      : <div className="search-bar">
          <SearchForm 
            handleSubmit={handleSubmit}
            localInputs={localInputs}
            setLocalInputs={setLocalInputs} />
        </div>
    }
    {isSubmitted && <LoaderPlane />}
    {isSubmitted && <div className="dialog-backdrop-loading"></div>}
    </>
  );
};

export default SearchBar;