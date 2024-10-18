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
            <div className="form-title"><b>Passenger</b></div>
            <PassengerForm />
            
            
        </div>
    )
}

export default PassengersDetails