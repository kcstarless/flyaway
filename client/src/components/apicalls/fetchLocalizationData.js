// fetchLocalizationData.js

const getLocation = async () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

// const getDestinationGeoCode = async (destination, countryCode) => {
//     const response = await fetch(`/api/v1/search/geocode_search_destination?`);
// }

// const getLanguageByCountryCode = async (countryCode) => {
//     const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
//     const data = await response.json();
//     return data[0].languages; // Returns an object with language codes
// }

// const getCountryFlag = async (countryCode) => {
//     const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
//     const data = await response.json();
//     return data[0].flags.svg;
// }

const fetchCountryData = async (countryCode) => {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    const data = await response.json();
    return data[0];
}

const getCountryData = async (position) => {
    try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude, longitude);
        const response = await fetch(`/api/v1/search/geocode?latitude=${latitude}&longitude=${longitude}`);
        if (response.ok) {         
            const data = await response.json();
            const countryName = data.result.components.country;
            const countryCode = data.result.components.country_code;
            const countryCurrency = data.result.annotations.currency.iso_code;
            const countryCurrencySymbol = data.result.annotations.currency.symbol;
            const countryData = await fetchCountryData(countryCode);
            const countryFlag = countryData.flags.svg;
            const countryLanguage = countryData.languages;

            return {
                country: countryName,
                countryCode: countryCode.toUpperCase(),
                currency: countryCurrency,
                language: Object.values(countryLanguage).join(', '),
                flag: countryFlag,
                currencySymbol: countryCurrencySymbol,
                geoLocation: { latitude: latitude, longitude: longitude },
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const fetchCountries = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies,cca2,flags,idd');
    const countries = await response.json();
    // console.log(countries);
    return countries;
};

export const fetchLocalizationData = async () => {
    try {
        const position = await getLocation();
        const countryData = await getCountryData(position);
        if (countryData) {
            return countryData;
        } else {
            throw new Error('No country data available');
        }
    } catch (error) {
        console.error(`Failed to fetch localization data: ${error.message}`);
        throw error; // Throw the error to ensure it is handled by React Query
    }
}

// fetchLocalizationData();