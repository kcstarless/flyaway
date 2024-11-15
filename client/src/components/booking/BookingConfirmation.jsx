import { useEffect, useRef, useState } from "react";
import { useContextFlightBooking } from "../contexts/ContextFlightBooking";
import { useContextFlightOffers } from "../contexts/ContextFlightOffers";
import { fetchCreateFlightBooking } from "../apicalls/fetchConfirmBooking";
import { useContextLocalization } from "../contexts/ContextLocalization";
import BookingTripHeader from './BookingTripHeader';
import { useLocation } from 'react-router-dom';
import BookingFlightDetailsExpanded from './BookingFlightDetailsExpanded';
import { getDateDayDDMMYYYY } from '../helpers/general';
import { LoaderPlane } from '../helpers/Loader';
import ActionCable from 'actioncable';
import axios from 'axios';
import { setSessionstorageItem, getSessionstorageItem } from "../helpers/localstorage";


const BookingConfirmation = () => {
    const { pricingOutbound, pricingReturn, setBookedOutbound, setBookedReturn, bookedOutbound, bookedReturn, travelerInfo, setTravelerInfo } = useContextFlightBooking();
    const { locations, selectedOutboundFlight, selectedReturnFlight } = useContextFlightOffers();
    const { localizationData } = useContextLocalization();
    const location = useLocation();
    const { paymentIntent } = location.state || {};
    const [loading, setLoading] = useState(getSessionstorageItem("charge") ? false : true);
    const [charge, setCharge] = useState(null);

    useEffect(() => {
        if (getSessionstorageItem('bookedOutbound') || getSessionstorageItem('bookedReturn')) {
            setBookedOutbound(getSessionstorageItem('bookedOutbound'));
            setBookedReturn(getSessionstorageItem('bookedReturn'));
            setCharge(getSessionstorageItem('charge'));
            setLoading(false);
            setTravelerInfo(getSessionstorageItem('travelerInfo'));
        }    
    }, []);

    useEffect(() => {
        // Function to fetch charge details using PaymentIntent ID
        const fetchChargeDetails = async (paymentIntentId) => {
            console.log("Fetching charge details...");
            try {
            const response = await axios.get(`/api/v1/payments/retrieve_charge`, {
                params: {
                payment_intent_id: paymentIntentId,
                },
            });
            return response.data.charge;
            } catch (error) {
            console.error("Error retrieving charge:", error);
            }
        }
        if (paymentIntent) {
            fetchChargeDetails(paymentIntent.id).then((charge) => {
                setCharge(charge);
                setSessionstorageItem('charge', charge);
            });
        }
    }, [paymentIntent]);
  
    // ActionCable for payment confirmation using websockets // requires Live Rails server or ngrok
    useEffect(() => {
        const cable = ActionCable.createConsumer(
            process.env.NODE_ENV === 'development'
              ? 'ws://localhost:3000/cable'
              : 'wss://flyaway-rails-react.fly.dev/cable'
          );
          console.log("Subscribed to NotificationsChannel");
        let subscription = cable.subscriptions.create('NotificationsChannel', {
            received(data) {
                if (data.event === 'charge.succeeded') {
                    console.log("Payment succeeded", data.charge);
                    setCharge(data.charge);
                    setSessionstorageItem('charge', data.charge);
                    console.log("Charge: ", data.charge);
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
        if (getSessionstorageItem('charge')) {
            alert("Payment already processed. Please check your email for confirmation.");
            return;
        }

        const amadeusConfirmBooking = async (travelerInfo) => {
            try {
                console.log("Confirming booking...");
                if (pricingOutbound) {
                    const response = await fetchCreateFlightBooking(pricingOutbound.data.flightOffers[0], travelerInfo);
                    setBookedOutbound(response);
                    setSessionstorageItem('bookedOutbound', response);
                    console.log("Booking confirmed: ", response);   
                }
                if (pricingReturn) {
                    const response = await fetchCreateFlightBooking(pricingReturn.data.flightOffers[0], travelerInfo);
                    setBookedReturn(response);
                    setSessionstorageItem('bookedReturn', response);
                    console.log(response);
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

    function displayConfirmationCard(flight, selectedFlight) {
        const passengersName = travelerInfo.map((passenger) => passenger.name.firstName + " " + passenger.name.lastName);
        // const flightInfo = flight.flightOffers[0].itineraries[0].segments[0];
        console.log("locatin data: ", locations)
        return (
            <>
            <div className="ticket">
                <div className="ticket-top">
                    <div className="ticket-header">
                        <div className="head-logo">
                            Ref No. {flight.data.associatedRecords[0].reference}
                        </div>
                        <div className="info-name">
                                    {getDateDayDDMMYYYY(selectedFlight.departureDateTime)}
                        </div>
                    </div>

                    <div className="ticket-body">
                        <div className="locations">
                            <div className="loc-depart">
                                {locations[selectedFlight.departureIata].cityName}
                                <h1>{selectedFlight.departureIata}</h1>
                            </div>
                            <div className="loc-direction">
                                <div className="arrow_2"></div>
                            </div>
                            <div className="loc-arrive">
                                {locations[selectedFlight.arrivalIata].cityName}
                                <h1>{selectedFlight.arrivalIata}</h1>
                            </div>
                        </div>

                        <div className="body-info">
                            <div className="info">
                                <div className="info-name">
                                    <p>Passengers</p>
                                    {passengersName.map((name, index) => (
                                        <h3 key={index}>{name}</h3>
                                    ))}
                                </div>
                            </div>
                            <div className="flight">
                                <div className="flight-details">
                                <BookingFlightDetailsExpanded
                                    flight = {selectedFlight}
                                    locations = {locations}
                                     />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="ticket-bottom">
                    <div className="bottom-info">
                        <div className="depart">
                            <div className="depart-terminal">
                                Terminal
                                <h2>1</h2>
                            </div>
                            <div className="depart-boarding">
                                Boarding
                                <h2>09:00 am</h2>
                            </div>
                        </div>

                        <div className="depart-barcode"></div>
                    </div>
                </div>
            </div>
            </>
        )
    }
    
    console.log("booked: ", bookedOutbound);
    console.log("pricing: ", pricingOutbound);

    return (
        <>
        { (loading || !getSessionstorageItem("charge"))
            
                ? (<><LoaderPlane messageTop="Your flight is being confirmed" messageBottom="Please wait..." /><div className="dialog-backdrop-loading"></div></>)

                : (<><BookingTripHeader />
                    <br />
                    <div className="booking-made">
                        {charge && (       
                            <div className="booking-confirmation-card">   
                            <fieldset className="payment-confirmation">
                                <h4>Payment processed.</h4>
                                <div className="item">Status: {charge.paid ? "Paid" : "Pending"} </div>
                                <div className="item">
                                    Amount paid: {localizationData.currencySymbol}{(charge.amount / 100).toFixed(2)} &nbsp;
                                    {charge.payment_method_details.card.brand} ending in {charge.payment_method_details.card.last4}
                                </div>
                                <div className="item">Paid on: {new Date(charge.created * 1000).toLocaleString()}</div>
                                <div className="item">Receipt can be viewed <a href={charge.receipt_url}>here</a>. A copy has been sent to your email.</div>
                            </fieldset>
                            <br />
                            </div>
                        )}

                        <div className="booking-card">
                            {bookedOutbound && Object.keys(bookedOutbound).length > 0 &&
                                displayConfirmationCard(bookedOutbound, selectedOutboundFlight)}
                            <br />
                            {bookedReturn && Object.keys(bookedReturn).length > 0 &&
                                displayConfirmationCard(bookedReturn, selectedReturnFlight)}
                        </div>

                    </div>
                    <br /></>)
            }   
        </>
    )
}

export default BookingConfirmation