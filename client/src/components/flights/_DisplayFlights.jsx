// components/search/display.jsx

import { useContextFlightOffers } from '../contexts/ContextFlightOffers';
import { useContextLocalization } from '../contexts/ContextLocalization';
import { filterFlightOffers, sortFlightOffers } from '../helpers/filterandsortflightOffers';
import FlightsSearchResult from './FlightsSearchResult';
import FlightsSort from './FlightsSort';
import FlightsPriceHistory from './FlightsPriceHistory';
import FlightsFilters from './FlightsFilters';
import { useFlightSearchQuery } from '../hooks/useFlightSearchQuery';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const DisplayFlights = () => {
    const { flightOffers, selectedOutboundFlight, isReturn, setSelectedOutboundFlight, setSelectedReturnFlight } = useContextFlightOffers();
    const { localizationData: { currencySymbol } } = useContextLocalization();
    const { refetchAll } = useFlightSearchQuery();
    const [noMatch, setNoMatch] = useState(null);
    const [sortOption, setSortOption] = useState("best");
    
    const navigate = useNavigate();

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
            isReturn ? refetchAll() : navigate("/flight_details");
        } 
        if (selectedOutboundFlight && isReturn) {
            setSelectedReturnFlight(flight);
            navigate("/flight_details");
        }
    }
   
    return (
        <div className="search-result">
            <FlightsPriceHistory />
            <FlightsSort 
                sortOption={sortOption} 
                setSortOption={setSortOption} 
                offersCount={offers.length} 
            />
            <FlightsFilters 
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
                <FlightsSearchResult
                    sortedOffers={offers}
                    currencySymbol={currencySymbol}
                    onFlightSelect={handleflightOfferselect}
                />
            )}
            <div className="ads">ads</div>
        </div>
    );
};

export default DisplayFlights;
