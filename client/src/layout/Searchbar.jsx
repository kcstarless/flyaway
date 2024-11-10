// Searchbar.jsx
import SearchForm from '../components/searchbar/SearchForm';
import { useState, useRef, useEffect } from 'react';
import { useContextFlightOffers } from '../components/contexts/ContextFlightOffers';
import { useContextFlightBooking } from '../components/contexts/ContextFlightBooking';
import { useFlightSearchQuery } from '../components/hooks/useFlightSearchQuery';
// import { validateForm, timeout } from '../components/helpers/general';
import { useNavigate } from "react-router-dom";
import { LoaderPlane } from '../components/helpers/Loader';
// import { useContextLoading } from '../components/contexts/ContextLoading';
// Validates flight search form data and set feedback
// Used in: Searchbar.jsx

const SearchBar = () => {
  const { updateFormData, resetFlightOffer, formData, setIsSubmitted } = useContextFlightOffers();
  const { resetFlightBooking } = useContextFlightBooking();
  const navigate = useNavigate(); 
  // const {loadingFlightOffers} = useContextLoading();


  // Custom hook to fetch search formData.
  const { outboundFlight } = useFlightSearchQuery();

  const onFlightDetailsPage = location.pathname === "/flight_details";
  const onCheckOutPage = location.pathname === "/checkout";
  const onBookingConfirmaitonPage = location.pathname ==="/booking_confirmation"
  // const onFlightSearchResultPage = location.pathname === "/flight_search_result";

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
  const prevInputsRef = useRef(localInputs);

  const handleSubmit = async (event) => {
    // event.preventDefault();

    // Validate form data
    // if (JSON.stringify(prevInputsRef.current) === JSON.stringify(localInputs)) { 
    //   console.log("No change in form data"); 
    //   setFormError('Please make changes to the form data.');
    //   return null;
    // }

    resetFlightBooking();
    resetFlightOffer();
    updateFormData(localInputs);              // Update the form data with localInputs.
    prevInputsRef.current = localInputs;      
    setIsSubmitted(true);
    navigate("/flight_search_result");
  };

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
    {(outboundFlight.isFetching) && <LoaderPlane messageTop={`${formData.current.departingCityName} to ${formData.current.destinationCityName}.`} messageBottom={"Please wait..."} />}
    {(outboundFlight.isFetching) &&<div className="dialog-backdrop-loading"></div>}
    </>
  );
};

export default SearchBar;