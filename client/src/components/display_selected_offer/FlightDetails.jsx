import takeoff_icon from '../../assets/images/icon_flighttakeoff.svg';
import landing_icon from '../../assets/images/icon_flightland.svg';
import { useFlightOffersContext } from '../contexts/FlightOffersContext';
import arrowDown_icon from '../../assets/images/icon_arrow_down.svg';
import { isoDateToHHMM24, capitalizeFirstLetters, getDateDayDDMMYYYY, getLayoverTime, formatDuration, minutesToHH } from '../helpers/general';
import { useState, useEffect } from 'react';
import { fetchLocation } from '../apicalls/fetchLocation';

const FlightDetails = () => {
    const { selectedOutboundFlight, selectedReturnFlight } = useFlightOffersContext();
    const [outboundDetailsOpen, setOutboundDetailsOpen] = useState(false);
    const [returnDetailsOpen, setReturnDetailsOpen] = useState(false);
    const [locations, setLocations] = useState({}); // To store location data
    const outboundItineraries = selectedOutboundFlight?.offer.itineraries[0].segments;
    const returnItineraries = selectedReturnFlight?.offer.itineraries[0].segments;
    const carriers = selectedOutboundFlight?.carriers;
    // const dictionary = selectedOutboundFlight.dictionary;

    console.log(selectedOutboundFlight);
    // console.log(locations);

    // Fetch location details for each segment
    useEffect(() => {
        const fetchLocations = async () => {
            const newLocations = {};
            if(outboundItineraries){
                for (const segment of outboundItineraries) {
                    const departureIATA = segment.departure.iataCode;
                    const arrivalIATA = segment.arrival.iataCode;
    
                    if (departureIATA && !newLocations[departureIATA]) {
                        newLocations[departureIATA] = await fetchLocation(departureIATA);
                    }
                    if (arrivalIATA && !newLocations[arrivalIATA]) {
                        newLocations[arrivalIATA] = await fetchLocation(arrivalIATA);
                    }
                }
            }
            if(returnItineraries) {
                for (const segment of returnItineraries) {
                    const departureIATA = segment.departure.iataCode;
                    const arrivalIATA = segment.arrival.iataCode;
                    
                    if (departureIATA && !newLocations[departureIATA]) {
                        newLocations[departureIATA] = await fetchLocation(departureIATA);
                    }
                    if (arrivalIATA && !newLocations[arrivalIATA]) {
                        newLocations[arrivalIATA] = await fetchLocation(arrivalIATA);
                    }
                }

            }
            setLocations(newLocations);
        };

        fetchLocations();
    }, [outboundItineraries, returnItineraries]);

    if (!selectedOutboundFlight && !selectedReturnFlight) { 
        return null; // Or handle the loading state appropriately
    }

    return (
        <div className="flight-details">
            <h3>Flight details</h3>
            {selectedOutboundFlight && (
                <>
                    <div>Outbound: {getDateDayDDMMYYYY(selectedOutboundFlight.departureDateTime)}</div>
                    <div className="flight-card">
                        <div className="itinerary-card" onClick={() => setOutboundDetailsOpen(!outboundDetailsOpen)}>
                            <div className="card-wrapper-c1">
                                <div className="itinerary-card-c1">
                                    <img src={selectedOutboundFlight.carrierLogo} alt="airline logo" className="img-airline-logo" />
                                </div>
                                <div className="itinerary-card-c2">
                                    <span><b>{selectedOutboundFlight.departureTime}</b></span>
                                    <span className="description2">{selectedOutboundFlight.departureIata}</span>
                                </div>
                                <div className="itinerary-card-c3">
                                    <div className="flight-path">
                                        <img src={takeoff_icon} alt="Takeoff" />
                                        <div className="flight-path-line"></div>
                                        {selectedOutboundFlight.stops > 0 && <div className="red-dot"></div>}
                                        <img src={landing_icon} alt="Landing" />
                                    </div>
                                    <div className="stops">
                                        <span className="duration">{selectedOutboundFlight.duration[0]}hrs</span>
                                        {selectedOutboundFlight.stops > 0 ? (
                                            <span className="stop">{selectedOutboundFlight.stops} stops</span>
                                        ) : (
                                            <span className="stop">direct</span>
                                        )}
                                    </div>
                                </div>
                                <div className="itinerary-card-c2">
                                    <span><b>{selectedOutboundFlight.arrivalTime}</b></span>
                                    <span className="description2">{selectedOutboundFlight.arrivalIata}</span>
                                </div>
                            </div>
                            <div className="card-wrapper-c2">
                                <div className="itinerary-card-c4">
                                    <img src={arrowDown_icon} alt="Icon" />
                                </div>
                            </div>
                        </div>
                        {outboundDetailsOpen ? (
                            <div className="details-opened">
                                {outboundItineraries.map((segment, index) => {
                                    const departureLocation = locations[segment.departure.iataCode];
                                    const arrivalLocation = locations[segment.arrival.iataCode];
                                    const segmentId = segment.id;
                                    const fareDetails = selectedOutboundFlight?.offer.travelerPricings[0].fareDetailsBySegment[index].amenities;
                                    const includedCheckedBags = selectedOutboundFlight?.offer.travelerPricings[0].fareDetailsBySegment[index].includedCheckedBags.quantity;
                                    
                                    return (
                                        <div key={index}>
                                            <div className="segment">
                                                <div className="vertical-line-container">
                                                    <div className="vertical-line">&nbsp;</div>
                                                </div>
                                                <div className="segment-detail">
                                                    <div className="airline">
                                                        <img src={`https://www.gstatic.com/flights/airline_logos/70px/${segment?.operating?.carrierCode || segment?.carrierCode}.png`} className="carrier-logo" />
                                                        <div>
                                                            {(segment?.operating?.carrierCode !== segment?.carrierCode) && <>(operated by)</>}
                                                            {capitalizeFirstLetters(carriers[segment?.operating?.carrierCode || segment?.carrierCode])}
                                                        </div>
                                                        <div>
                                                            {segment?.carrierCode}-{segment?.number}
                                                        </div>
                                                    </div>
                                                    <div className="departure">
                                                        <p className='medium time'><b>{isoDateToHHMM24(segment.departure.at)}</b></p>
                                                        <p className='medium'>{departureLocation ? departureLocation.locationName : <span className="loading__bar"></span>}</p>
                                                    </div>
                                                    <div className="duration">
                                                        <p className='medium-smalls time'>
                                                            {minutesToHH(formatDuration(segment.duration)[1])}hrs  
                                                        </p>
                                                        <p className="small">
                                                            {selectedOutboundFlight.dictionary.aircraft[segment.aircraft.code]} 
                                                        </p>
                                                    </div>
                                                    <div className="arrival">
                                                        <p className="medium time"><b>{isoDateToHHMM24(segment.arrival.at)}</b></p>
                                                        <p className="medium">{arrivalLocation ? arrivalLocation.locationName : <span className="loading__bar"></span>}</p>
                                                    </div>
                                                    <div className="details">
                                                         <p>Checked in baggage: {includedCheckedBags !== 0 ? includedCheckedBags : "none"} &bull;&nbsp;</p>
                                                         <p>Amenities</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {index < outboundItineraries.length - 1 && (
                                                <div className="layover">
                                                    <div className="layover-time">
                                                        <p className={arrivalLocation ? "medium-small" : "loading__bar"}>
                                                             {getLayoverTime(segment.arrival.at, outboundItineraries[index + 1].departure.at)}hrs in {arrivalLocation && arrivalLocation.cityName}
                                                             {(getLayoverTime(segment.arrival.at, outboundItineraries[index + 1].departure.at) > 3) && <b> Long wait</b>}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                </>
            )}
    
            {selectedReturnFlight && (
                <>
                    <div>Return flight: {getDateDayDDMMYYYY(selectedReturnFlight.departureDateTime)}</div>
                    <div className="flight-card">
                        <div className="itinerary-card" onClick={() => setReturnDetailsOpen(!returnDetailsOpen)}>
                            <div className="card-wrapper-c1">
                                <div className="itinerary-card-c1">
                                    <img src={selectedReturnFlight.carrierLogo} alt="airline logo" className="img-airline-logo" />
                                </div>
                                <div className="itinerary-card-c2">
                                    <span><b>{selectedReturnFlight.departureTime}</b></span>
                                    <span className="description2">{selectedReturnFlight.departureIata}</span>
                                </div>
                                <div className="itinerary-card-c3">
                                    <div className="flight-path">
                                        <img src={takeoff_icon} alt="Takeoff" />
                                        <div className="flight-path-line"></div>
                                        {selectedReturnFlight.stops > 0 && <div className="red-dot"></div>}
                                        <img src={landing_icon} alt="Landing" />
                                    </div>
                                    <div className="stops">
                                        <span className="duration">{selectedReturnFlight.duration[0]}hrs</span>
                                        {selectedReturnFlight.stops > 0 ? (
                                            <span className="stop">{selectedReturnFlight.stops} stops</span>
                                        ) : (
                                            <span className="stop">direct</span>
                                        )}
                                    </div>
                                </div>
                                <div className="itinerary-card-c2">
                                    <span><b>{selectedReturnFlight.arrivalTime}</b></span>
                                    <span className="description2">{selectedReturnFlight.arrivalIata}</span>
                                </div>
                            </div>
                            <div className="card-wrapper-c2">
                                <div className="itinerary-card-c4">
                                    <img src={arrowDown_icon} alt="Icon" />
                                </div>
                            </div>
                        </div>
                        {returnDetailsOpen ? (
                            <div className="details-opened">
                                {returnItineraries.map((segment, index) => {
                                    const departureLocation = locations[segment.departure.iataCode];
                                    const arrivalLocation = locations[segment.arrival.iataCode];
    
                                    return (
                                        <div key={index}>
                                            <div className="segment">
                                                <div className="vertical-line-container">
                                                    <div className="vertical-line">&nbsp;</div>
                                                </div>
                                                <div className="segment-detail">
                                                    <div className="airline">
                                                        <img src={`https://www.gstatic.com/flights/airline_logos/70px/${segment?.operating?.carrierCode || segment?.carrierCode}.png`} className="carrier-logo" />
                                                        {capitalizeFirstLetters(carriers[segment?.operating?.carrierCode || segment?.carrierCode])}
                                                        {segment?.carrierCode}
                                                        {segment?.number}
                                                    </div>
                                                    <div className="departure">
                                                        <p>{isoDateToHHMM24(segment.departure.at)}</p>
                                                        <p>{departureLocation ? departureLocation.locationName : <span className="loading__bar"></span>}</p>
                                                    </div>
                                                    <div className="duration">
                                                        <p>{formatDuration(segment.duration)[0]}</p>
                                                    </div>
                                                    <div className="arrival">
                                                        <p>{isoDateToHHMM24(segment.arrival.at)}</p>
                                                        <p>{arrivalLocation ? arrivalLocation.locationName : <span className="loading__bar"></span>}</p>
                                                    </div>
                                                    <div className="details">
                                                         <p>{segment?.carrierCode}{segment?.number}&bull;{selectedOutboundFlight.dictionary.aircraft[segment.aircraft.code]}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {index < returnItineraries.length - 1 && (
                                            <div className="layover">
                                                <div className="layover-time">
                                                <p className={arrivalLocation ? "medium-small" : "loading__bar"}>
                                                             {getLayoverTime(segment.arrival.at, returnItineraries[index + 1].departure.at)} hrs in {arrivalLocation && arrivalLocation.cityName}
                                                             {(getLayoverTime(segment.arrival.at, returnItineraries[index + 1].departure.at) > 3) && <b> Long wait</b>}
                                                        </p>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                </>
            )}
        </div>
    );    
};

export default FlightDetails;
