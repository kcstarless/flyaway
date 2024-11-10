import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useQuery } from "@tanstack/react-query"
import { fetchLocalizationData } from '../apicalls/fetchLocalizationData';
import { getLocalstorageItem, setLocalstorageItem } from '../helpers/localstorage';

const ContextLocalization = createContext();

export const ProviderLocalization = ({ children }) => {
    const currencyChanged = useRef(false);
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
    
    const localData = getLocalstorageItem("localizationData");
    const [localizationData, setLocalizationData] = useState(localData || defaultLocalizationData);
    
    const localizationQuery = useQuery({
        queryKey: ["localizationData"],
        queryFn: fetchLocalizationData,
        enabled: !localData,
    });

    useEffect(() => {
        if (localizationQuery.isSuccess) {
            setLocalizationData(localizationQuery.data);
            setLocalstorageItem("localizationData", localizationQuery.data);
        } 
        if(localizationQuery.isError || !localizationQuery) {
            console.log("Failed to load localization data. Using default data.");
            setLocalizationData(defaultLocalizationData);
        }
    }, [localizationQuery.isFetched]);


    const updateLocalizationData = (newData) => {
        setLocalizationData((prevData) => {
            const updatedData = { ...prevData, ...newData };
            currencyChanged.current = true;
            return updatedData;
        });
    };
    
    return (
        <ContextLocalization.Provider value={{
            localizationData,
            localizationQuery,
            updateLocalizationData,
            currencyChanged,
        }}>
            {children}
        </ContextLocalization.Provider>
    )
}

export const useContextLocalization = () => useContext(ContextLocalization);