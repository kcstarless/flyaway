// TripHeader.jsx
import { useFlightOffersContext } from '../contexts/FlightOffersContext';
import { numberCommas } from '../helpers/general';
import { useLocalizationContext } from '../contexts/LocalizationContext';

const TripHeader = () => {
    const { selectedOutboundFlight, selectedReturnFlight, formData, isReturn } = useFlightOffersContext();
    const {localizationData} = useLocalizationContext();
    if (!selectedOutboundFlight) {
        return null; // Or handle the loading state appropriately
    }

    const totalPrice = selectedReturnFlight ? selectedOutboundFlight.price + selectedReturnFlight.price : selectedOutboundFlight.price;
    const noOfPassengers = selectedOutboundFlight.offer.travelerPricings.length;

    return (
        <div className="trip-details">
        <div>
            <div className="trip-title">
                <h3>{formData.departingCityName} &rarr; {formData.destinationCityName}</h3>
            </div>
            <div className="trip-desc">
                <p>
                    {isReturn ? "Round trip" : "One way"} &bull; 
                    Economy &bull; {noOfPassengers} passengers               
                </p>
            </div>
        </div>
        <div className="trip-price">
            <h3>{localizationData.currency} {localizationData.currencySymbol}{numberCommas(totalPrice)}</h3>
            <p>total price</p>
        </div>   
    </div>
    )
}

export default TripHeader;
