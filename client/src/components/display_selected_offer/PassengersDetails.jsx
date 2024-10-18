// PassengersDetails 
import { useFlightOffersContext } from '../contexts/FlightOffersContext';
import PassengerForm from './PassengerForm';

const PassengersDetails = () => {
    const { selectedOutboundFlight } = useFlightOffersContext();
    
    if (!selectedOutboundFlight) {
        return null; // Or handle the loading state appropriately
    }
    return (
        <div className="passenger-details">
            <h3>Traveller Details</h3>
            <PassengerForm />
        </div>
    )
}

export default PassengersDetails