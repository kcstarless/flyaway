import takeoff_icon from '../../assets/images/icon_flighttakeoff.svg';
import landing_icon from '../../assets/images/icon_flightland.svg';
import { useContextLoading } from '../contexts/ContextLoading';
import PropTypes from 'prop-types'; // Import PropTypes
import { useEffect, useState } from 'react';

const FlightsSearchResult = ({sortedOffers, currencySymbol, onFlightSelect }) => {
    const [visibleCount, setVisibleCount] = useState(10);
    const offers = sortedOffers.slice(0, visibleCount);
    const {loadingFlightOffers} = useContextLoading();

    const handleShowMore = () => {
        setVisibleCount((prevCount) => prevCount + 10);
    }

    useEffect(() => {
        setVisibleCount(10);
    }, [sortedOffers]);

    const handleSelectedFlight = (offer) => {
        onFlightSelect(offer);
    }
    
    return (
        <div className={loadingFlightOffers ? "results loading" : "results"}>
            {offers.map((offer) => 
                <div key={offer.offerId} className="itinerary-card">
                    <div className="card-wrapper-c1">
                        <div className="itinerary-card-c1">
                            <img src={offer.carrierLogo} alt="airline logo" className="img-airline-logo" />
                            {/* <span className="description">{capitalizeFirstLetters(offer.carrierName)}</span> */}
                        </div>
                        <div className="itinerary-card-c2">
                            <span><b>{offer.departureTime}</b></span>
                            <span className="description2">{offer.departureIata}</span>
                        </div>
                        <div className="itinerary-card-c3">
                            <div className="flight-path">
                                <img src={takeoff_icon} />
                                <div className="flight-path-line"></div>
                                {offer.stops > 0 && <div className="red-dot"></div>}
                                <img src={landing_icon} />
                            </div>
                            <div className="stops">
                                <span className="duration">{offer.duration[0]}hrs</span>
                                {offer.stops > 0 ? (<span className="stop">{offer.stops} stops</span>) : (<span className="stop">direct</span>)}
                            </div>
                        </div>
                        <div className="itinerary-card-c2">
                            <span><b>{offer.arrivalTime}</b></span>
                            <span className="description2">{offer.arrivalIata}</span>
                        </div>
                    </div>
                    <div className="card-wrapper-c2">
                        <div className="itinerary-card-c4">
                            {currencySymbol}{offer.price}
                        </div>
                        <button type="button" onClick={() => handleSelectedFlight(offer)} className="btn btn--secondary">Select</button>
                    </div>
                </div>
            )}
            {visibleCount < sortedOffers.length && ( // Check if there are more offers
                <button onClick={handleShowMore} className="btn btn--primary">Show More</button>
            )}
        </div>
    )
}

// Add PropTypes
FlightsSearchResult.propTypes = {
    sortedOffers: PropTypes.arrayOf(PropTypes.shape({
        offerId: PropTypes.string.isRequired,
        carrierLogo: PropTypes.string.isRequired,
        carrierName: PropTypes.string.isRequired,
        departureTime: PropTypes.string.isRequired,
        departureIata: PropTypes.string.isRequired,
        stops: PropTypes.number.isRequired,
        duration: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string, // formatted string
            PropTypes.number, // total minutes
        ])).isRequired,
        arrivalTime: PropTypes.string.isRequired,
        arrivalIata: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    })).isRequired,
    currencySymbol: PropTypes.string.isRequired,
};


export default FlightsSearchResult;
