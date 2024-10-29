import { useEffect, useState } from "react";
import { useContextFlightBooking } from "../contexts/ContextFlightBooking"
import BookingTripHeader from './BookingTripHeader';
import { useLocation } from 'react-router-dom';
import { fetchCreateFlightBooking } from "../apicalls/fetchConfirmBooking";
import ActionCable from 'actioncable';


const BookingConfirmation = () => {
    const { pricingOutbound, pricingReturn, setBookedOutbound, setBookedReturn, bookedOutbound, bookedReturn, travelerInfo } = useContextFlightBooking();
    const location = useLocation();
    const { paymentIntent } = location.state || {};
    const [loading, setLoading] = useState(null);

    // ActionCable for payment confirmation using websockets // requires Live Rails server or ngrok
    useEffect(() => {
        const cable = ActionCable.createConsumer('ws://localhost:3000/cable');
        let subscription = cable.subscriptions.create('NotificationsChannel', {
            received(data) {
                if (data.event === 'charge.succeeded') {
                    console.log("Payment succeeded", data.charge);
                    setCharge(data.charge);
                }
            }
        });
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        }
    }, []);


    // Confirm booking through Amadeus API
    useEffect(() => {
        const amadeusConfirmBooking = async (travelerInfo) => {
            try {
                setLoading(true);
                if (pricingOutbound) {
                    const response = await fetchCreateFlightBooking(pricingOutbound.data.flightOffers[0], travelerInfo);
                    setBookedOutbound(response);
                    // console.log(response);
                }
                if (pricingReturn) {
                    const response = await fetchCreateFlightBooking(pricingReturn.data.flightOffers[0], travelerInfo);
                    setBookedReturn(response);
                    // console.log(response);
                }
                setLoading(false);
            } catch (err) {
                console.log("Error fetching confirmed flight: ", err);
            }
        }

        if (paymentIntent) { 
            amadeusConfirmBooking(travelerInfo);
        } else {
            console.error("Something went wrong")
        }
    }, [paymentIntent]);

    console.log(bookedOutbound.data);

    return (
        <>
            <BookingTripHeader />
            <h3>Payment has been processed.</h3>
            <br />
            {/* {charge && (
                <div>
                    <h5>Receipt</h5>
                    <p>{charge.amount}</p>
                </div>
            )} */}
            { paymentIntent.id }
            <h4>We are almost there. Now confirmig flight...</h4>
            {loading && <div className="loading__bar long"></div>}
            {bookedOutbound && Object.keys(bookedOutbound).length > 0 ? (
                loading 
                ? (<h3>Loading...</h3>)
                : (
                    <ul>
                        <li>
                            Book ref. number: {bookedOutbound.data.associatedRecords[0].reference}
                        </li>
                        <li>
                            Book status: {bookedOutbound.data.ticketingAgreement.option.toLowerCase()} 
                        </li>
                        <li>
                            Confirmed on : {bookedOutbound.data.associatedRecords[0].reference}
                        </li>
                    </ul>
                    ) 
            ) : (
                <p>No outbound flight booked.</p>
            )}
            <br />
            {bookedReturn && Object.keys(bookedReturn).length > 0 ? (
                loading
                ? (<h3>Loading...</h3>)
                : (
                    <ul>
                        <li>
                            Book ref. number: {bookedReturn.data.associatedRecords[0].reference}
                        </li>
                        <li>
                            Book status: {bookedReturn.data.ticketingAgreement.option.toLowerCase()} 
                        </li>
                        <li>
                            Confirmed on : {bookedReturn.data.associatedRecords[0].reference}
                        </li>
                    </ul>
                )
            ) : (
                <p>No outbound flight booked.</p>
            )}
        </>
    )
}

export default BookingConfirmation