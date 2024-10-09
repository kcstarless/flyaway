// FlightSearchResultDisplay.jsx

import { useFlightOffersContext } from './contexts/FlightOffersContext';
import { useLocalizationContext } from './contexts/LocalizationContext';
import { filterFlightOffers, sortFlightOffers } from './helpers/filterandsortflightOffers';
import DisplayFlights from './display_search_result/DisplayFlights';
import SortOptions from './display_search_result/SortOptions';
import FlightPriceHistory from './display_search_result/FlightPriceHistory';
import FilterOptions from './display_search_result/FilterOptions';
import { useState, useEffect } from 'react';

const FlightSearchResultDisplay = () => {
    const { flightOffers, selectedOutboundFlight, setSelectedOutboundFlight } = useFlightOffersContext();
    const { localizationData } = useLocalizationContext();
    const { currencySymbol } = localizationData;

    const [noMatch, setNoMatch] = useState(null);
    const [offers, setOffers] = useState([]);
    const [sortOption, setSortOption] = useState("best");
    
    // List of filters for flight offers data
    const [filterOption, setFilterOption] = useState({
        direct: true,
        oneStop: true,
        twoPlusStops: true,
        departTimeRange: [0, 1439],
        travelTime: null,
        airlines: {}, //Keeps track of airlines eg{ name: true }
    });
    
    // Filters offers first then sort fight offers
    useEffect(() => {
        // const data = !selectedOutboundFlight ? flightOffers : returnFlights 
        const filteredOffers = filterFlightOffers(filterOption, flightOffers);
        const sorted = sortFlightOffers(sortOption, filteredOffers);
        setOffers(sorted); // Store the filtered and sorted offers

        // Check if no flights match and set the noMatch state
        if (sorted.length === 0) {
            setNoMatch("No flights matched. Please refine your search and filters.");
        } else {
            setNoMatch(null); // Reset noMatch if flights are found
        }

    }, [filterOption, flightOffers, sortOption, selectedOutboundFlight]);

    if (!flightOffers || flightOffers.length === 0) {
        return null;
    }
    
    const handleflightOfferselect = (flight) => {
        selectedOutboundFlight === null && setSelectedOutboundFlight(flight);
    }
    // console.log(selectedOutboundFlight);
    // console.log(selectedReturnFlight);
    return (
        <div className="search-result">
            <FlightPriceHistory />
            <SortOptions 
                sortOption={sortOption} 
                setSortOption={setSortOption} 
                offersCount={offers.length} 
            />
            <FilterOptions 
                filters={filterOption} 
                setFilters={setFilterOption}
            />
            {noMatch ? (
                <div className="results">
                    <div className="itinerary-card">
                        <div className="no-match">
                            <p>{noMatch}
                            <button className="btn btn--select-all">Show all results</button>
                            </p> 
                        </div>
                    </div>
                </div>
            ) : (
                <DisplayFlights
                    sortedOffers={offers}
                    currencySymbol={currencySymbol}
                    onFlightSelect={handleflightOfferselect}
                />
            )}
            <div className="ads">ads</div>
        </div>
    );
};

export default FlightSearchResultDisplay;
