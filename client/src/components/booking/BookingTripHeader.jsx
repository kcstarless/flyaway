// TripHeader.jsx
import { useContextFlightOffers } from '../contexts/ContextFlightOffers';
import { useContextFlightBooking } from "../contexts/ContextFlightBooking";
import { numberCommas } from '../helpers/general';
import { useContextLocalization } from '../contexts/ContextLocalization';
import { useLocation } from "react-router-dom"; // Import useLocation

const BookingTripHeader = () => {
    const { selectedOutboundFlight, formData, isReturn } = useContextFlightOffers();
    const { grandTotal, passengers } = useContextFlightBooking();
    const {localizationData} = useContextLocalization();

    const location = useLocation();
    const onFlightDetailsPage = location.pathname === "/flight_details";
    const onCheckOutPage = location.pathname === "/checkout";
    const onBookingConfirmaitonPage = location.pathname ==="/booking_confirmation"

    if (!selectedOutboundFlight) {
        return null; // Or handle the loading state appropriately
    }
    
    return (
        <div className="trip-details">
            <div>
                <div className="trip-title">
                    <h3>{formData.departingCityName} &rarr; {formData.destinationCityName}</h3>
                </div>
                <div className="trip-desc">
                    <p>
                        {isReturn ? "Round trip" : "One way"} &bull; 
                        Economy &bull; {passengers} passengers               
                    </p>
                </div>
            </div>
            <div className="trip-confirmation">
                <div>
                    {onFlightDetailsPage ? <h5>Passengers</h5> : <p>Passengers</p>}  
                </div>
                    &bull; 
                <div>
                    {onCheckOutPage ? <h5>Payment</h5> : <p>Payment</p>}
                </div>
                    &bull;
                <div> 
                    {onBookingConfirmaitonPage ? <h5>Confirmation</h5> : <p>Confirmation</p>}
                </div>
            </div>
            <div className="trip-price">
                <h3>{localizationData.currency} {localizationData.currencySymbol}{numberCommas(grandTotal)}</h3>
                <p>total price</p>
            </div>   
        </div>
    )
}

export default BookingTripHeader;