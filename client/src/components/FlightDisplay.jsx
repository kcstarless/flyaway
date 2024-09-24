import { useFlightContext } from '../contexts/FlightContext';


const FlightDisplay = () => {
    const { flightData } = useFlightContext();

    return (
        <div className="search-result">
            {flightData.length > 0 ? (
            flightData.map((offer) => (
                <div key={offer.id} className="flight-offer">
                {offer.itineraries.map((itinerary, index) => (
                    <div key={index} className="itinerary">
                    <p>Duration: {itinerary.duration}</p>
                    {itinerary.segments.map((segment, segIndex) => (
                        <div key={segIndex} className="segment">
                        <p>Departure: {segment.departure.iataCode} at {segment.departure.at}</p>
                        <p>Arrival: {segment.arrival.iataCode} at {segment.arrival.at}</p>
                        <p>Carrier: {segment.carrierCode} {segment.number}</p>
                        <p>Duration:{segment.duration} </p>
                        </div>
                    ))}
                    </div>
                ))}
                <p>Total Price: {offer.price.total} {offer.price.currency}</p>
                </div>
            ))
            ) : (
                <p>No flight offers available.</p>
            )}
        </div>
    )
}

export default FlightDisplay;