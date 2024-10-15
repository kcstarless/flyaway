import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalizationContext } from '../contexts/LocalizationContext';

const FlightOffersContext = createContext();

export const FlightOffersProvider = ({ children }) => {
    const { localizationData } = useLocalizationContext();
    const { currency, currencySymbol } = localizationData;
    
    const[flightOffers, setFlightOffers] = useState([]);
    const[flightPriceHistory, setFlightPriceHistory] = useState([]);
    const[isReturn, setIsReturn] = useState(false);
    const[selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);
    const[selectedReturnFlight, setSelectedReturnFlight] = useState(null);
    // const[currencyChanged, setCurrencyChanged] = useState(false);
    const[isSubmitted, setIsSubmitted] = useState(false);

    // Flight search form data
    const [formData, setFormData] = useState({
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

    // if outbound flight is picked and isReturn is true then change the departing date to return date on the form
    useEffect(() => {
        if (selectedOutboundFlight && isReturn) {
            setFormData(prev => ({
                ...prev,
                departingIATA: prev.destinationIATA,
                departingCityName: prev.destinationCityName,
                destinationIATA: prev.departingIATA,
                destinationCityName: prev.departingCityName,
                departDate: prev.returnDate,
                // returnDate: null, // Reset return date after updating depart date
            }));
        }
    }, [selectedOutboundFlight, isReturn]);
    
    // If return date is present then set to true
    useEffect (() => {
        if (formData.returnDate) {
            // console.log("is Return");
            setIsReturn(true) ;
        } else {
            setIsReturn(false);
            // console.log("is Oneway");
        }
    }, [formData.returnDate]); 

    // If currency is changed in localization set it to true to re-render.
    useEffect(() => {
        setFormData(prev => ({ ...prev, currencyCode: currency }));
        // setCurrencyChanged(true); // Mark that currency has changed
    }, [currency]);

    return (
        <FlightOffersContext.Provider value={{ 
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
            setFormData,
            // currencyChanged,
            // setCurrencyChanged,
            isSubmitted,
            setIsSubmitted,
            }}>
            {children}
        </FlightOffersContext.Provider>
    );
};

export const useFlightOffersContext = () => useContext(FlightOffersContext);

