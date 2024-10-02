import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import { useLocalizationContext } from '../contexts/LocalizationContext';
import { fetchCountries } from "../apicalls/fetchLocalizationData";

const currenciesList = (countries) => {
    // Create a unique set of currencies with their symbols
    const uniqueCurrenciesMap = new Map();

    countries.forEach(country => {
        if (country.currencies) {
            const currencyEntries = Object.entries(country.currencies);
            currencyEntries.forEach(([code, info]) => {
                const symbol = info.symbol || code; // Fallback to code if symbol is missing
                uniqueCurrenciesMap.set(code, symbol); // Map will ensure uniqueness by key
            });
        }
    });
    // Convert the map to an array and sort it
    return Array.from(uniqueCurrenciesMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}


const SetLocalization = ({ isOpen, onRequestClose }) => {
    const { localizationData, updateLocalizationData } = useLocalizationContext();
    const { countryCode, currency } = localizationData;
    const [countries, setCountries] = useState([]);
    const [selectedCountryCode, setSelectedCountryCode] = useState(countryCode);
    const [selectedCurrency, setSelectedCurrency] = useState(currency);

    useEffect(() => {
        setSelectedCountryCode(countryCode);
    }, [countryCode])

    useEffect(() => {
        setSelectedCurrency(currency);
    }, [currency])
    
    useEffect(() => {
        if (isOpen) {
            const loadCountries = async () => {
                const fetchedCountries = await fetchCountries();
                // Sort countries alphabetically by common name
                const sortedCountries = fetchedCountries.sort((a, b) => 
                    a.name.common.localeCompare(b.name.common)
                );
                setCountries(sortedCountries);
            };

            loadCountries();
        }
    }, [isOpen]); // Fetch countries when modal opens  

    // Updates the country selection in the modal
    const handleCountryChange = async (event) => {
        const newCountryCode = event.target.value;
        setSelectedCountryCode(newCountryCode);

        // Find the selected country to update currency
        const newCountry = countries.find(country => country.cca2 === newCountryCode);
        if (newCountry) {
            setSelectedCurrency(Object.keys(newCountry.currencies)[0]);
        }
    };

    // Updates the currency selection in the modal
    const handleCurrencyChange = (event) => {
        setSelectedCurrency(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const newCountry = countries.find(country => country.cca2 === selectedCountryCode)
        console.log(newCountry);
        
        updateLocalizationData({
            countryCode: selectedCountryCode,
            currency: selectedCurrency,
            flag: newCountry.flags.svg, // Directly get flag
            country: newCountry.name.common, // Directly get country name
            language: 'English', // Or the selected language
            currencySymbol: currenciesList(countries).find(([code]) => code === selectedCurrency)[1],
        });
        onRequestClose(); // Close the modal
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="set-user-local">
            <div className="modal-header">
                <h4>Regional Settings</h4>
            </div>

            <div className="modal-body">
                <form className="modal-form" onSubmit={handleSubmit}>
                    <label htmlFor="language">Language</label>
                    <select id="language" name="language">
                        <option value="en">English</option>
                        <option value="es">Spanish(working progress)</option>
                        <option value="fr">French(working progress)</option>
                    </select>

                    <label htmlFor="country">Country</label>
                    <select id="country" name="country" value={selectedCountryCode} onChange={handleCountryChange}>
                        {countries.map((country, index) => (
                            <option key={index} value={country.cca2}>{country.name.common}</option>
                        ))}
                    </select>

                    <label htmlFor="currency">Currency</label>
                    <select id="currency" name="currency" value={selectedCurrency} onChange={handleCurrencyChange}>
                        {currenciesList(countries).map(([currencyCode, currencySymbol], index) => (
                            <option key={index} value={currencyCode}>
                                {currencyCode} ({currencySymbol})
                            </option>
                        ))}
                    </select>

                    <button type="submit">Save</button>
                    <button onClick={onRequestClose}>Close</button>
                </form>
            </div>

            <div className="modal-footer">
            </div>
        </Modal>
    );
};
export default SetLocalization;