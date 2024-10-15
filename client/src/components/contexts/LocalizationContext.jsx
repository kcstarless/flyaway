import React, { createContext, useState, useEffect, useContext } from 'react';
import { useQuery } from "@tanstack/react-query"
import { fetchLocalizationData } from '../apicalls/fetchLocalizationData';

const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
    // Define default localization data if it fails to load
    const defaultLocalizationData = {
        language: 'English',
        flag: 'https://flagcdn.com/us.svg',
        country: 'United States',
        currency: 'USD',
        currencySymbol: '$',
        countryCode: 'US',
    }
    const [localizationData, setLocalizationData] = useState(defaultLocalizationData);
    
    const localizationQuery = useQuery({
        queryKey: ["localizationQuery", localizationData.currency],
        queryFn: fetchLocalizationData,
        // enabled: !!localizationData.currency
    })

    useEffect(() => {
        if (localizationQuery.data) {
            setLocalizationData(localizationQuery.data);
        }
    }, [localizationQuery.data]);

    const updateLocalizationData = (newData) => {
        setLocalizationData((prevData) => ({
            ...prevData,
            ...newData
        }));
    };
    
    return (
        <LocalizationContext.Provider value={{
            localizationData,
            localizationQuery,
            updateLocalizationData,
        }}>
            {children}
        </LocalizationContext.Provider>
    )
}

export const useLocalizationContext = () => useContext(LocalizationContext);