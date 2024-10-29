// FlightDetails.jsx
import BookingFlightDetails from './BookingFlightDetails';
import BookingTripHeader from './BookingTripHeader';
import BookingPassengers from './BookingPassengers';

const BookingDetails = () => {

    return (
        <div className="booking-details">
            <BookingTripHeader />
            <BookingPassengers />
            <BookingFlightDetails />
        </div>
    )
}

export default BookingDetails