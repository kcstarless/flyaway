// FlightSearchResultDisplay.jsx

import { useFlightOffersContext } from '../contexts/FlightOffersContext';
import { useLocalizationContext } from '../contexts/LocalizationContext';
import { filterFlightOffers, sortFlightOffers } from '../helpers/filterandsortflightOffers';
import DisplayFlights from './DisplayFlights';
import SortOptions from './SortOptions';
import FlightPriceHistory from './FlightPriceHistory';
import FilterOptions from './FilterOptions';
import { useFlightSearchQuery } from '../hooks/useFlightSearchQuery';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const FlightSearchResultDisplay = () => {
    const { flightOffers, selectedOutboundFlight, isReturn, setSelectedOutboundFlight, setSelectedReturnFlight } = useFlightOffersContext();
    const { localizationData: { currencySymbol } } = useLocalizationContext();
    const navgiate = useNavigate();

    const [noMatch, setNoMatch] = useState(null);
    const [sortOption, setSortOption] = useState("best");
    
    const { refetchAll } = useFlightSearchQuery();
    // List of filters for flight offers data
    const [filterOption, setFilterOption] = useState({
        direct: true,
        oneStop: true,
        twoPlusStops: true,
        departTimeRange: [0, 1439],
        travelTime: null,
        airlines: {}, //Keeps track of airlines eg{ name: true }
    });

    // Inside your FlightSearchResultDisplay component
    const offers = useMemo(() => {
        const filteredOffers = filterFlightOffers(filterOption, flightOffers);
        const sortedOffers = sortFlightOffers(sortOption, filteredOffers);
    
        // Check if no flights match and set the noMatch state
        if (sortedOffers.length === 0) {
            setNoMatch("No flights matched. Please refine your search and filters.");
        } else {
            setNoMatch(null); // Reset noMatch if flights are found
        }
    
        return sortedOffers;
    }, [filterOption, flightOffers, sortOption]); // Dependencies

    if (!flightOffers || flightOffers.length === 0) {
        return null;
    }
    
    const handleflightOfferselect = (flight) => {
        if (selectedOutboundFlight === null) {
            setSelectedOutboundFlight(flight);
            isReturn ? refetchAll() : navgiate("/flight_details");
        } 
        if (selectedOutboundFlight && isReturn) {
            setSelectedReturnFlight(flight);
            navgiate("/flight_details");
        }
    }
   
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
