// fetchLocalizationData.js

const getLocation = async () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

// const getDestinationGeoCode = async (destination, countryCode) => {
//     const response = await fetch(`/api/v1/search/geocode_search_destination?`);
// }

const getLanguageByCountryCode = async (countryCode) => {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    const data = await response.json();
    return data[0].languages; // Returns an object with language codes
}

const getCountryFlag = async (countryCode) => {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    const data = await response.json();
    return data[0].flags.svg;
}

const getCountryData = async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const response = await fetch(`/api/v1/search/geocode?latitude=${latitude}&longitude=${longitude}`);
    const data = await response.json();
    const countryName = data.result.components.country;
    const countryCode = data.result.components.country_code;
    const countryCurrency = data.result.annotations.currency.iso_code;
    const countryCurrencySymbol = data.result.annotations.currency.symbol;
    const countryFlag = await getCountryFlag(countryCode);
    const countryLanguage = await getLanguageByCountryCode(countryCode);

    return {
        country: countryName,
        countryCode: countryCode.toUpperCase(),
        currency: countryCurrency,
        language: Object.values(countryLanguage).join(', '),
        flag: countryFlag,
        currencySymbol: countryCurrencySymbol
    }
}
export const fetchCountries = async () => {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies,cca2,flags,idd');
    const countries = await response.json();
    // console.log(countries);
    return countries;
};

export const fetchLocalizationData = async () => {
    // console.log("Fetching localization data..."); // Add this line
    try {
        const position = await getLocation();
        const countryData = await getCountryData(position);
        // console.log(countryData); 
        return countryData
    } catch (error) {
        console.log(error);
    }
}
// fetchLocalizationData();