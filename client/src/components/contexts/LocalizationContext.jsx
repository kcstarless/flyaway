import React, { createContext, useState, useEffect, useContext } from 'react';
import { useQuery } from "@tanstack/react-query"
import { fetchLocalizationData } from '../apicalls/fetchLocalizationData';

const LocalizationContext = createContext();

export const LocalizationProvider = ({ children }) => {
    const localizationQuery = useQuery({
        queryKey: ["localizationQuery"],
        queryFn: fetchLocalizationData,
    })

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

    // const [localizationData, setLocalizationData] = useState(
    //     {
    //         language: 'English', flag: 'https://flagcdn.com/us.svg', country: 'United State', currency: 'USD', currencySymbol: '$', countryCode: 'US'
    //     });
    
    // const updateLocalizationData = (newData) => {
    //     setLocalizationData((prevData) => ({
    //         ...prevData,
    //         ...newData
    //     }));
    // };
    // console.log("Up to here is okay");
    // fetchLocalizationData().then(data => console.log(data));

    // const { data, error, isLoading } = useQuery({
    //     queryKey: ["localizationQuery"],
    //     queryFn: fetchLocalizationData,
    //     onSuccess: (fetchedData) => {
    //         console.log("Fetched Data in onSuccess:", fetchedData);
    //         // Update the localizationData state with fetched data
    //         setLocalizationData((prevData) => ({
    //             ...prevData,
    //             ...fetchedData
    //         }));
    //     },
    // });

    // return (
    //     <LocalizationContext.Provider value={ {localizationData, updateLocalizationData} } >
    //         {children}
    //     </LocalizationContext.Provider>
    // )