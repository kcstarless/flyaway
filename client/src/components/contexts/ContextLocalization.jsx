import React, { createContext, useState, useEffect, useContext } from 'react';
import { useQuery } from "@tanstack/react-query"
import { fetchLocalizationData } from '../apicalls/fetchLocalizationData';

const ContextLocalization = createContext();

export const ProviderLocalization = ({ children }) => {
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
        queryKey: ["localizationData"],
        queryFn: fetchLocalizationData,
        enabled: true,
    });
    useEffect(() => {
        if (localizationQuery.data) {
            setLocalizationData(localizationQuery.data);
        }
    }, [localizationQuery.data]);

    // useEffect(() => {
    //     // Fetch localization data on the initial load
    //     const loadLocalizationData = async () => {
    //         const data = await fetchLocalizationData();
    //         if (data) {
    //             setLocalizationData(data);
    //         }
    //     };
    //     loadLocalizationData();
    // }, []); // Run only once on component mount

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
        }}>
            {children}
        </ContextLocalization.Provider>
    )
}

export const useContextLocalization = () => useContext(ContextLocalization);