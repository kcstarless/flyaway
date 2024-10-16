import takeoff_icon from '../../assets/images/icon_flighttakeoff.svg';
import landing_icon from '../../assets/images/icon_flightland.svg';
import luggage_icon from '../../assets/images/icon_luggage.svg';
import noLuggage_icon from '../../assets/images/icon_no_luggage.svg';
import arrowDown_icon from '../../assets/images/icon_arrow_down.svg';
import { isoDateToHHMM24, capitalizeFirstLetters, getLayoverTime, formatDuration, minutesToHHDecimal, capitalizeFirstLetterOnly } from '../helpers/general';
import { MdRestaurantMenu, MdAirlineSeatLegroomExtra, MdOutlineAirplaneTicket  } from 'react-icons/md';
import { CiWifiOn } from "react-icons/ci";
import { BiSolidDrink } from "react-icons/bi";
import { RiMovieLine } from "react-icons/ri"
import React, { useState } from 'react';
// FlightSummary Component for the clickable itinerary card
const FlightSummary = ({ flight, toggleDetails }) => (
    <div className="itinerary-card" onClick={toggleDetails}>
        <div className="card-wrapper-c1">
            <div className="itinerary-card-c1">
                <img src={flight.carrierLogo} alt="airline logo" className="img-airline-logo" />
            </div>
            <div className="itinerary-card-c2">
                <span><b>{flight.departureTime}</b></span>
                <span className="description2">{flight.departureIata}</span>
            </div>
            <div className="itinerary-card-c3">
                <div className="flight-path">
                    <img src={takeoff_icon} alt="Takeoff" />
                    <div className="flight-path-line"></div>
                    {flight.stops > 0 && <div className="red-dot"></div>}
                    <img src={landing_icon} alt="Landing" />
                </div>
                <div className="stops">
                    <span className="duration">{flight.duration[0]}hrs</span>
                    <span className="stop">{flight.stops > 0 ? `${flight.stops} stops` : 'direct'}</span>
                </div>
            </div>
            <div className="itinerary-card-c2">
                <span><b>{flight.arrivalTime}</b></span>
                <span className="description2">{flight.arrivalIata}</span>
            </div>
        </div>
        <div className="card-wrapper-c2">
            <div className="itinerary-card-c4">
                <img src={arrowDown_icon} alt="Toggle Details" />
            </div>
        </div>
    </div>
);

const listAmenities = (amenities) => {
    console.log(amenities);
    if (amenities.length === 0) {
        return (<p className="small">No amenities listed on this flight.</p>)
    }
    return (
        <>
            <ul>
                {amenities.map((amen, index) => (
                    <li key={index}>
                        <span className="amenities-description">{capitalizeFirstLetterOnly(amen.description)}</span>
                        <span className="chargeable">{amen.isChargeable ? <span className="yes">&#36;</span> : <span className="no">&#10003;</span>}</span>
                    </li>
                ))}
            </ul>
            <br />
            <span className="chargeable line">
                <span className="yes">&#36; </span>chargeable &nbsp;&nbsp;
                <span className="no">&#10003; </span>included
            </span>
            
        </>
    )
}

const Amenities = ({ flight, index }) => {
    const includedCheckedBags = flight?.offer.travelerPricings[0].fareDetailsBySegment[index]?.includedCheckedBags?.quantity 
                                || flight?.offer.travelerPricings[0].fareDetailsBySegment[index]?.includedCheckedBags?.weight || [];
    const amenities = flight?.offer.travelerPricings[0].fareDetailsBySegment[index].amenities || [];
    const [isDialogOpen, setDialogOpen] = useState(false);
    return (
        <>
        {includedCheckedBags > 0
            ? includedCheckedBags < 3 
                ? <p className="small"><img src={luggage_icon} alt="Luggage" />{includedCheckedBags}x included</p> 
                : <p className="small"><img src={luggage_icon} alt="luggage" />{includedCheckedBags}kg included</p>
            : <p className="small"><img src={noLuggage_icon} alt="No Luggage" /> no included luggage</p>}
        <div className="amenities-list">
            <span className="amenities-detail" onMouseOver={() => setDialogOpen(true)}  onMouseLeave={() => setDialogOpen(false)}>
                amenities&rarr;
                <MdRestaurantMenu className="icon" />
                <BiSolidDrink className="icon"/>
                <MdAirlineSeatLegroomExtra className="icon" />
                <CiWifiOn className="icon" />
                <RiMovieLine className="icon"/>
                <MdOutlineAirplaneTicket className="icon" />
                {isDialogOpen && (
                    <dialog open className="amenities-dialog">
                        {listAmenities(amenities)}
                    </dialog>
                )}
            </span>
        </div>
        </>
    )
}
// SegmentDetails Component for rendering segment details
const SegmentDetails = ({ segment, index, departureLocation, arrivalLocation, flight, carriers }) => {

    console.log(flight);
    return (
        <div className="segment">
            <div className="vertical-line-container">
                <div className="vertical-line">&nbsp;</div>
            </div>
            <div className="segment-detail">
                <div className="airline">
                    <img src={`https://www.gstatic.com/flights/airline_logos/70px/${segment?.operating?.carrierCode || segment?.carrierCode}.png`} className="carrier-logo" />
                    <div>
                        {(segment?.operating?.carrierCode !== segment?.carrierCode) && <b>Operated by </b>}
                        {capitalizeFirstLetters(carriers[segment?.operating?.carrierCode || segment?.carrierCode])}
                    </div>
                    <div>{segment?.carrierCode}-{segment?.number}</div>
                </div>
                <div className="departure">
                    <p className='medium time'><b>{isoDateToHHMM24(segment.departure.at)}</b></p>
                    <p className='medium'>{departureLocation ? departureLocation.locationName : <span className="loading__bar"></span>}</p>
                </div>
                <div className="duration">
                    <p className='medium-smalls time'>{minutesToHHDecimal(formatDuration(segment.duration)[1])}hrs</p>
                    <p className="small">{flight.dictionary.aircraft[segment.aircraft.code]}</p>
                </div>
                <div className="arrival">
                    <p className="medium time"><b>{isoDateToHHMM24(segment.arrival.at)}</b></p>
                    <p className="medium">{arrivalLocation ? arrivalLocation.locationName : <span className="loading__bar"></span>}</p>
                </div>
                <div className="amenities">
                    <Amenities flight={flight} index={index} />
                </div>
            </div>
        </div>
    );
};

// LayoverDetails Component for layover information
const LayoverDetails = ({ layoverTime, arrivalLocation }) => (
    <div className="layover">
        <div className="layover-time">
            <p className={arrivalLocation ? "medium-small" : "loading__bar"}>
                {layoverTime}hrs in <b>{arrivalLocation?.cityName}</b>
                {layoverTime >= 3 && <b> ...long wait</b>}
            </p>
        </div>
    </div>
);

// Main FlightsDetailsExpanded Component
const FlightsDetailsExpanded = ({ flight, detailsOpen, setDetailsOpen, itineraries, locations, carriers }) => {
    const toggleDetails = () => setDetailsOpen(!detailsOpen);

    return (
        <div className="flight-card">
            <FlightSummary flight={flight} detailsOpen={detailsOpen} toggleDetails={toggleDetails} />

            {detailsOpen && (
                <div className="details-opened">
                    {itineraries.map((segment, index) => {
                        const departureLocation = locations[segment.departure.iataCode];
                        const arrivalLocation = locations[segment.arrival.iataCode];
                        const layoverTime = index < itineraries.length - 1 ? getLayoverTime(segment.arrival.at, itineraries[index + 1].departure.at) : null;

                        return (
                            <div key={index}>
                                <SegmentDetails
                                    segment={segment}
                                    index={index}
                                    departureLocation={departureLocation}
                                    arrivalLocation={arrivalLocation}
                                    flight={flight}
                                    carriers={carriers}
                                />
                                {layoverTime && (
                                    <LayoverDetails layoverTime={layoverTime} arrivalLocation={arrivalLocation} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FlightsDetailsExpanded;
