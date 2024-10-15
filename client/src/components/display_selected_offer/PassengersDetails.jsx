// PassengersDetails 
import { useFlightOffersContext } from '../contexts/FlightOffersContext';

const PassengersDetails = () => {
    const { selectedOutboundFlight } = useFlightOffersContext();
    
    if (!selectedOutboundFlight) {
        return null; // Or handle the loading state appropriately
    }
    return (
        <div className="passenger-details">
            <h3>Passenger Details</h3>
        </div>
    )
}

export default PassengersDetails