import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useQuery } from "@tanstack/react-query"
import { fetchLocalizationData } from '../apicalls/fetchLocalizationData';

const ContextLocalization = createContext();

export const ProviderLocalization = ({ children }) => {
    const locationDataFetchedRef = useRef(false);
    // Define default localization data if it fails to load
    const defaultLocalizationData = {
        language: 'English',
        flag: 'https://flagcdn.com/us.svg',
        country: 'United States',
        currency: 'USD',
        currencySymbol: '$',
        countryCode: 'US',
        geoLocation: { latitude: 37.7749, longitude: -122.4194 },
    }

    const [localizationData, setLocalizationData] = useState({defaultLocalizationData});
    
    const localizationQuery = useQuery({
        queryKey: ["localizationData"],
        queryFn: fetchLocalizationData,
        // enabled: false,
    });

    useEffect(() => {
        if (localizationQuery.isSuccess) {
            setLocalizationData(localizationQuery.data);
        } 
        locationDataFetchedRef.current = true;
        if(localizationQuery.isError || !localizationQuery) {
            console.log("Failed to load localization data. Using default data.");
            setLocalizationData(defaultLocalizationData);
        }
    }, [localizationQuery.isFetched]);


    const updateLocalizationData = (newData) => {
        console.log('Previous Data:', localizationData);
        console.log('New Data:', newData);
    
        setLocalizationData((prevData) => {
            const updatedData = { ...prevData, ...newData };
    
            // Log the updated data to see the difference
            console.log('Updated Data:', updatedData);
    
            return updatedData;
        });
    };
    
    return (
        <ContextLocalization.Provider value={{
            localizationData,
            localizationQuery,
            updateLocalizationData,
            locationDataFetchedRef,
        }}>
            {children}
        </ContextLocalization.Provider>
    )
}

export const useContextLocalization = () => useContext(ContextLocalization);