// PassengersDetails 
import BookingPassengersForm from './BookingPassengersForm';
import { getSessionstorageItem } from '../helpers/localstorage';

const BookingPassengers = () => {
    const outboundFlight = getSessionstorageItem('selectedOutboundFlight');
    // const { selectedOutboundFlight } = useContextFlightOffers();
    
    if (!outboundFlight) {
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