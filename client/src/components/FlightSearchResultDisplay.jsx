import { useFlightOffersContext } from './contexts/FlightOffersContext';
import { useLocalizationContext } from './contexts/LocalizationContext';
import { filterFlightOffers, sortFlightOffers } from './helpers/filterandsortflightOffers';
import DisplayFlights from './display_search_result/DisplayFlights';
import SortOptions from './display_search_result/SortOptions';
import FilterOptions from './display_search_result/FilterOptions';
import React, { useState, useEffect } from 'react';

const FlightSearchResultDisplay = () => {
    const { flightOffersData } = useFlightOffersContext();
    const { localizationData } = useLocalizationContext();
    const { currencySymbol } = localizationData;

    const [error, setError] = useState(null);
    const [offers, setOffers] = useState([]);
    const [sortOption, setSortOption] = useState("best");

    const [filterOption, setFilterOption] = useState({
        direct: true,
        oneStop: true,
        twoPlusStops: true,
        airlines: {}
    });
    
    useEffect(() => {
        const filteredOffers = filterFlightOffers(filterOption, flightOffersData);
        const sorted = sortFlightOffers(sortOption, filteredOffers);
        setOffers(sorted); // Store the filtered and sorted offers

                // Check if no flights match and set the error state
                if (sorted.length === 0) {
                    setError("No Flights Matched");
                } else {
                    setError(null); // Reset error if flights are found
                }

    }, [filterOption, flightOffersData, sortOption]);



    if (!flightOffersData || flightOffersData.length === 0) {
        return null;
    }

    return (
        <div className="search-result">
            <SortOptions 
                sortOption={sortOption} 
                setSortOption={setSortOption} 
                offersCount={offers.length} 
            />
            <FilterOptions 
                filters={filterOption} 
                setFilters={setFilterOption}
            />
            {error ? (
                <div>{error}</div>
            ) : (
                <DisplayFlights
                    sortedOffers={offers}
                    currencySymbol={currencySymbol}
                />
            )}
            <div className="ads">ads</div>
            {/* <div>{error}</div> */}
        </div>
    );
};

export default FlightSearchResultDisplay;
