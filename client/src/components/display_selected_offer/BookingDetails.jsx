// FlightDetails.jsx
import FlightDetails from './FlightDetails';
import TripHeader from './TripHeader';
import PassengersDetails from './PassengersDetails';

const BookingDetails = () => {

    return (
        <div className="booking-details">
            <TripHeader />
            <PassengersDetails />
            <FlightDetails />
        </div>
    )
}

export default BookingDetails