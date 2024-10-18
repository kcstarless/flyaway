// FlightDetails.jsx
import FlightDetails from './FlightDetails';
import TripHeader from './TripHeader';
import PassengersDetails from './PassengersDetails';
import { FlightBookingProvider } from '../contexts/FlightBookingContext';

const BookingDetails = () => {

    return (
        <FlightBookingProvider>
        <div className="booking-details">
            <TripHeader />
            <PassengersDetails />
            <FlightDetails />
        </div>
        </FlightBookingProvider>
    )
}

export default BookingDetails