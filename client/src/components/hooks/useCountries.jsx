import { useState, useEffect } from "react";
import { fetchCountries } from "../apicalls/fetchLocalizationData";

export const useCountries = () => {
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        const loadCountries = async () => {
            try {
                const fetchedCountries = await fetchCountries();
                const sortedCountries = fetchedCountries.sort((a, b) => (
                    a.name.common.localeCompare(b.name.common) // Fixed typo here
                ));
                setCountries(sortedCountries);
            } catch (error) {
                console.log(error.message);
            }
        };
        loadCountries();
    }, []);
    return { countries }
}