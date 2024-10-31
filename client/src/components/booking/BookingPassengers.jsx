// PassengersDetails 
import { useContextFlightOffers } from '../contexts/ContextFlightOffers';
import BookingPassengersForm from './BookingPassengersForm';

const BookingPassengers = () => {
    const { selectedOutboundFlight } = useContextFlightOffers();
    
    if (!selectedOutboundFlight) {
        return null; // Or handle the loading state appropriately
    }
    return (
        <div className="passenger-details">
            <h3>Traveller Details</h3>
            <BookingPassengersForm />
        </div>
    )
}

export default BookingPassengers