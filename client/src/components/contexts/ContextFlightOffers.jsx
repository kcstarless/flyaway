import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useContextLocalization } from './ContextLocalization';
import { setSessionstorageItem, getSessionstorageItem, clearSessionstorage } from '../helpers/localstorage';

const ContextFlightOffers = createContext();

export const ProviderContextFlightOffers = ({ children }) => {
    const { localizationData, currencyChanged } = useContextLocalization();
    const { currency, currencySymbol } = localizationData;
    
    const [flightOffers, setFlightOffers] = useState([]);
    const [flightPriceHistory, setFlightPriceHistory] = useState([]);
    const [isReturn, setIsReturn] = useState(false);
    const [selectedOutboundFlight, setSelectedOutboundFlight] = useState(getSessionstorageItem('selectedOutboundFlight') || null);
    const [selectedReturnFlight, setSelectedReturnFlight] = useState(getSessionstorageItem('selectedReturnFlight') || null);    
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [locations, setLocations] = useState(getSessionstorageItem('locations') || {});

    // Initialize formData with useRef instead of useState
    const formData = useRef({
        departingIATA: '',
        departingCityName: '',
        departingCountryCode: '',
        departingGeoCode: '',
        destinationIATA: '',
        destinationCityName: '',
        destinationCountryCode: '',
        destinationGeoCode: '',
        departDate: null,
        returnDate: null,
        passengers: 1,
        currencyCode: currency, // Initialize with current currency
        currencySymbol: currencySymbol,
    });

    // Update formData via useRef, and trigger re-render manually when needed
    const updateFormData = (newData) => {
        formData.current = { ...formData.current, ...newData };
        setSessionstorageItem('formData', formData.current);
        // setIsSubmitted((prev) => !prev);  // Trigger a re-render
    };

    // if outbound flight is picked and isReturn is true then change the departing date to return date on the form
    const flipFormData = () => {
        updateFormData({
            departingIATA: formData.current.destinationIATA,
            departingCityName: formData.current.destinationCityName,
            destinationIATA: formData.current.departingIATA,
            destinationCityName: formData.current.departingCityName,
            departDate: formData.current.returnDate,
        });
    }

    // If return date is present then set to true
    useEffect(() => {
        if (formData.current.returnDate) {
            setIsReturn(true);
        } else {
            setIsReturn(false);
        }
    }, [formData.current.returnDate]);

    // If currency is changed in localization set it to true to re-render.
    useEffect(() => {
        if (currencyChanged.current) {
            console.log("Currency changed in localization context");
            updateFormData({ currencyCode: currency, currencySymbol: currencySymbol });
        }
    }, [currency]);

    function resetFlightOffer() {
        // console.log("Resetting flight offers context");
        setFlightOffers([]);
        setFlightPriceHistory([]);
        setSelectedOutboundFlight(null);
        setSelectedReturnFlight(null);
        setIsSubmitted(false);
        setLocations({});
        clearSessionstorage();
    }

    return (
        <ContextFlightOffers.Provider value={{ 
            flightOffers, 
            setFlightOffers,
            flightPriceHistory,
            setFlightPriceHistory,
            selectedOutboundFlight,
            setSelectedOutboundFlight,
            selectedReturnFlight,
            setSelectedReturnFlight,
            setIsReturn,
            isReturn,
            formData,
            updateFormData,
            isSubmitted,
            setIsSubmitted,
            resetFlightOffer,
            setLocations,
            locations,
            flipFormData,
        }}>
            {children}
        </ContextFlightOffers.Provider>
    );
};

export const useContextFlightOffers = () => useContext(ContextFlightOffers);
