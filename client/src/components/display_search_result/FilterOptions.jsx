// FilterOptions.jsx
import React, { useState, useEffect } from "react";
import { FlightOffersProvider, useFlightOffersContext } from '../contexts/FlightOffersContext';
import { filterFlightOffers } from "../helpers/filterandsortflightOffers";

const FilterOptions = ({ filters, setFilters}) => {
    const { flightOffersData, setFlightOffersData } = useFlightOffersContext();
    // console.log(flightOffersData)

    useEffect (() => {
        if (flightOffersData.length > 0) {
            const populateAirlines = {};
            flightOffersData.forEach(offer => {
                populateAirlines[offer.carrierName] = true; // Add each airline with value of true
            });

            setFilters((prevFilters) => ({
                ...prevFilters,
                airlines: populateAirlines, // Update filters with all the airlines
            }));
        }
    }, [flightOffersData, setFilters]);

    const handleFlightStops = (event) => {
        const { name, checked } = event.target;
        const newFilters = { ...filters, [name]: checked };
        setFilters(newFilters);
    }

    // Filter unique airlines
    // function airlinesFilter() {
    //     const airlines = {};
    //     const offeredAirlines = [];
        
    //     flightOffersData.forEach(offer => {
    //         if (!airlines[offer.carrierName]) {
    //             airlines[offer.carrierName] = true;
    //             offeredAirlines.push({code: offer.carrierCode, name: offer.carrierName});
    //         }
    //     });
    //     // console.log(offeredAirlines);
    //     // console.log(airlines)
    //     return offeredAirlines;
    // } 

    function handleAirlineSelect(event) {
        const { name, checked } = event.target;
        const updatedAirlines = {...filters.airlines, [name]: checked };
        setFilters({...filters, airlines: updatedAirlines});
        console.log(updatedAirlines);
    }

    return (
        <div className="filters">
            <div className="filter-r1">
                <label>Stop(s)</label><br />
                <label>
                    <input type="checkbox" 
                        name="direct" 
                        checked={filters.direct}
                        onChange={handleFlightStops}
                    />
                direct</label><br />
                <label>
                    <input type="checkbox"
                        name="oneStop" 
                        checked={filters.oneStop}
                        onChange={handleFlightStops}
                    /> 
                1stop</label><br />
                <label>
                    <input type="checkbox"
                        name="twoPlusStops" 
                        checked={filters.twoPlusStops}
                        onChange={handleFlightStops}
                     />
                2+ stops</label><br />
            </div>
            <div className="filter-r2">
                <label>Departure times</label>
            </div>
            <div className="filter-r3">
                <label>Time to destination</label>
            </div>
            <div className="filter-r3">
                <label>Airlines</label>
                {Object.keys(filters.airlines).map((airline) => (
                    <div key={airline}>
                        <label>
                            <input
                                type="checkbox"
                                name={airline}
                                checked={filters.airlines[airline]}
                                onChange={handleAirlineSelect}
                            />
                            {airline}
                        </label>
                    </div>
                ))}
                {/* {airlinesFilter().map((airline) => (
                    <div key={airline.code}>
                        <label>
                            <input type="checkbox"
                                    name={airline.name}
                                    checked={filters.airlines && filters.airlines[airline.name]} 
                                    onChange={handleAirlineSelect}
                            />
                        {airline.name}</label>
                    </div>
                ))} */}
            </div>
        </div>
    )
}

export default FilterOptions;