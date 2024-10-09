// FilterOptions.jsx
import { useState, useEffect } from "react";
import { useFlightOffersContext } from '../contexts/FlightOffersContext';
import { useLocalizationContext } from "../contexts/LocalizationContext";
import { capitalizeFirstLetters } from "../helpers/general";
import { useLoadingContext } from '../contexts/LoadingContext';
import arrowDown_icon from '../../assets/images/icon_arrow_down.svg';
import { minutesToHHMM24, minutesToHH } from "../helpers/general";
import Slider from '@mui/material/Slider';

const FilterOptions = ({ filters, setFilters}) => {
    const { flightOffers } = useFlightOffersContext();
    const { localizationData } = useLocalizationContext();
    const { loadingFlightOffers } = useLoadingContext();
    const [stopsOpen, setStopsOpen] = useState(true);
    const [airlinesOpen, setAirlinesOpen] = useState(false);
    const [departureTimeOpen, setDepartureTimeOpen] = useState(false);
    const [travelTimeOpen, setTravelTimeOpen] = useState(false);

    // Compute stops found based on flightOffers
    const stopsFound = flightOffers.reduce((acc, offer) => {
        if (offer.stops === 0) acc.direct = true;
        if (offer.stops === 1) acc.oneStop = true;
        if (offer.stops >= 2) acc.twoPlusStops = true;
        return acc;
    }, { direct: false, oneStop: false, twoPlusStops: false });
    
    // const [timeRange, setTimeRange] = useState([0, 1439]);
    // console.log(timeRange);dd

    // Populate the filter airline properties with all available airlines
    useEffect (() => {
        if (flightOffers.length > 0) {
            const populateAirlines = {};
            flightOffers.forEach(offer => {
                populateAirlines[offer.carrierName] = true; // Add each airline with value of true
            });

            setFilters((prevFilters) => ({
                ...prevFilters,
                airlines: populateAirlines, // Update filters with all the airlines
            }));
        }
    }, [flightOffers, setFilters]);

    useEffect (() => {
        const duration = flightOffers.map(offer => offer.duration[1]);
        // const min = Math.min(...duration);
        const max = Math.max(...duration);
        // const minMax = [min, max];
        // console.log("Min travel time:", min, "Max travel time:", max); // Debugging lo
        setFilters((prevFilters) => ({
            ...prevFilters,
            travelTime: max,
        }))
    }, [flightOffers, setFilters])

    // Gets lowest price for given filter eg(direct)
    function getPrice(stops) {
        const query = flightOffers
            .filter(offer => stops >= 1 ? offer.stops >= stops : offer.stops === stops)
            .map(offer => offer.price);
        if (query.length === 0) {
            return `no flights`
        } 
        const fromPrice = Math.min(...query);
        return `from ${localizationData.currencySymbol}${fromPrice}`;
    }

    // Get min and max flight duration
    const travelTimeRange = flightOffers.length > 0 
        ? [
            Math.min(...flightOffers.map(offer => offer.duration[1])),
            Math.max(...flightOffers.map(offer => offer.duration[1]))
        ]
        : [0, 0]; // Fallback in case there are no offers

    // Gets Airline lowest price
    function getAirlinePrice(airline) {
        const query = flightOffers
            .filter(offer => offer.carrierName === airline)
            .map(offer => offer.price);
        
        const fromPrice = Math.min(...query);
        return `from ${localizationData.currencySymbol}${fromPrice}`;
    } 

    // Toggle select and clear all button
    function toggleSelectAll(allSelected) {
        const updatedAirlines = Object.keys(filters.airlines).reduce((acc, airline) => {
            acc[airline] = allSelected; // Set each airline to true or false
            return acc; // Return the udpate airline key value
        }, {});
    
        setFilters(prevFilters => ({
            ...prevFilters,
            airlines: updatedAirlines
        }));
    }

    // Handle flight stops filter
    const handleFlightStops = (event) => {
        const { name, checked } = event.target;
        const newFilters = { ...filters, [name]: checked };
        setFilters(newFilters);
    }
    // Handle airline select filter
    function handleAirlineSelect(event) {
        const { name, checked } = event.target;
        const updatedAirlines = {...filters.airlines, [name]: checked };
        setFilters({...filters, airlines: updatedAirlines});
    }
    // Handle range for departure time
    function handleDepartureTime(event) {
        const { name, value} = event.target;
        const updatedDepartureTimeRange = {...filters, [name]: value} 
        setFilters(updatedDepartureTimeRange);
        // console.log(filters.departTimeRange);
    }
    // Handle range range for travel time
    function handleTravelTime(event, newValue) {
        setFilters(prevFilters => ({
            ...prevFilters,
            travelTime: newValue // Update to reflect both min and max travel time
        }));
    }
    return (
        <div className="filters">
            <div className="filter-r1">
                <div className="filter-title" onClick={() => setStopsOpen(!stopsOpen)}>
                    <h4>Stops</h4>
                    <img src={arrowDown_icon} alt="icon"></img>
                </div>
                
                {stopsOpen ? (
                <>
                <div className="r1-item">
                    <div className="item-title">
                        <input type="checkbox" 
                            name="direct" 
                            checked={filters.direct}
                            onChange={handleFlightStops}
                            disabled={loadingFlightOffers || !stopsFound.direct} 
                        />
                        <div className="title">Direct</div>
                    </div>
                    <div className="item-from-price">{getPrice(0)}</div>
                </div>
                
                <div className="r1-item">
                    <div className="item-title">
                        <input type="checkbox" 
                            name="oneStop" 
                            checked={filters.oneStop}
                            onChange={handleFlightStops}
                            disabled={loadingFlightOffers || !stopsFound.oneStop}
                        />
                        <div className="title">1 stop</div>
                    </div>
                    <div className="item-from-price">{getPrice(1)}</div>
                </div>

                <div className="r1-item">
                    <div className="item-title">
                        <input type="checkbox" 
                            name="twoPlusStops" 
                            checked={filters.twoPlusStops}
                            onChange={handleFlightStops}
                            disabled={loadingFlightOffers || !stopsFound.twoPlusStops}
                        />
                        <div className="title">2+ stops</div>
                    </div>
                    <div className="item-from-price">{getPrice(2)}</div>
                </div>
                </>
                ) : null}
            </div>

            <div className="filter-r1">
                <div className="filter-title" onClick={() => setDepartureTimeOpen(!departureTimeOpen)}>
                    <h4>Departure times</h4>
                    <img src={arrowDown_icon} alt="icon"></img>
                </div>
                {departureTimeOpen ? (
                <div className="filter-item">
                    <div className="slider-title">
                        <div className="outbound-title">Outbound: </div>
                        <div className="outbound-time">
                            {minutesToHHMM24(filters.departTimeRange[0])} &nbsp;- &nbsp;
                            {minutesToHHMM24(filters.departTimeRange[1])}
                        </div>    
                    </div>
                    <div className="filter-slider">
                        <Slider
                            // valueLabelDisplay="auto"
                            disabled={loadingFlightOffers}
                            name="departTimeRange"
                            value={filters.departTimeRange}
                            onChange={handleDepartureTime}
                            min={0} // Minimum value (start of day, 00:00)
                            max={1439} // Maximum value (end of day, 23:59)
                            step={30} // Step in increments of 1 minute
                            // valueLabelFormat={minutesToHHMM24} // Format the value label to "HH:mm"
                            marks={[
                                { value: 720, label: '12:00' },
                            ]}
                        />
                    </div>
                </div>
                    ) : ( 
                        null
                )}
            </div>

            <div className="filter-r1">
                <div className="filter-title" onClick={() => setTravelTimeOpen(!travelTimeOpen)}>
                    <h4>Travel duration</h4>
                    <img src={arrowDown_icon} alt="icon"></img>
                </div>
                {travelTimeOpen ? (
                <div className="filter-item">
                    <div className="slider-title">
                        <div className="outbound-title">Duration: </div>
                        <div className="outbound-time">
                            {minutesToHH(travelTimeRange[0])}hrs &nbsp;- &nbsp;
                            {minutesToHH(filters.travelTime)}hrs
                        </div>    
                    </div>
                    <div className="filter-slider">
                            <Slider
                                // valueLabelDisplay="auto"
                                disabled={loadingFlightOffers}
                                name="travelTime"
                                value={filters.travelTime}
                                onChange={handleTravelTime}
                                min={travelTimeRange[0]} 
                                max={travelTimeRange[1]} 
                                // valueLabelFormat={minutesToHHMM24}
                                step={10} 
                            />
                    </div>
                </div>
                ) : ( 
                    null
                )}
            </div>
            
            <div className="filter-r1">
                <div className="filter-title" onClick={() => setAirlinesOpen(!airlinesOpen)}>
                    <h4>Airlines</h4>
                    <img src={arrowDown_icon} alt="icon"></img>
                </div>
                {airlinesOpen ? (
                <>
                    <div className="select-all">
                        <button className="btn btn--select-all" onClick={() => toggleSelectAll(true)}>Select all</button>
                        <button className="btn btn--select-all" onClick={() => toggleSelectAll(false)}>Clear all</button>
                    </div>
                    {Object.keys(filters.airlines).map((airline) => (
                        <div key={airline} className="r1-item">
                            <div className="item-title">
                                <input
                                    type="checkbox"
                                    name={airline}
                                    checked={filters.airlines[airline]}
                                    onChange={handleAirlineSelect}
                                    disabled={loadingFlightOffers}
                                />
                                <div className="title">{capitalizeFirstLetters(airline)}</div>
                            </div>
                            <div className="item-from-price">from {getAirlinePrice(airline)}</div>
                        </div>
                    ))}
                </>) : null }
            </div>
        </div>
    )
}

export default FilterOptions;