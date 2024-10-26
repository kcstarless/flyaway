import { useFlightBookingContext } from "../contexts/FlightBookingContext"

const BookingConfirmation = () => {
    const { bookedOutbound, bookedReturn } = useFlightBookingContext();

    return (
        <>
            <h1>Booking Confirmation</h1>

            <h4>Outbound Flight</h4>
            {bookedOutbound && Object.keys(bookedOutbound).length > 0 ? (
                <ul>
                    {Object.entries(bookedOutbound).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {JSON.stringify(value)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No outbound flight booked.</p>
            )}

            <h4>Return Flight:</h4>
            {bookedReturn && Object.keys(bookedReturn).length > 0 ? (
                <ul>
                    {Object.entries(bookedReturn).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {JSON.stringify(value)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No return flight booked.</p>
            )}
        </>
    )
}

export default BookingConfirmation