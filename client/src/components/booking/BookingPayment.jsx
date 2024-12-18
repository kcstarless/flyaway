import { useContextFlightBooking } from "../contexts/ContextFlightBooking.jsx";
import { useContextLocalization } from "../contexts/ContextLocalization.jsx";
import { STRIPE_PK_KEY, API_URL } from '../../constants.js'
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import BookingTripHeader from './BookingTripHeader.jsx';
import axios from "axios";
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import BookingFlightDetails from "./BookingFlightDetails.jsx";
import { numberCommas } from '../helpers/general';
import { getSessionstorageItem, setSessionstorageItem } from "../helpers/localstorage.js";
import { LoaderPlane } from '../helpers/Loader';

// Loads stripe.js 
const stripePromise = loadStripe(STRIPE_PK_KEY);
// console.log('Stripe Publishable Key:', STRIPE_PK_KEY);
// console.log('API URL:', API_URL);
// Stripe payment element 
const PaymentForm = ({ clientSecret }) => {
    
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { grandTotal } = useContextFlightBooking();
    const {localizationData} = useContextLocalization();
    const { bookedOutbound, bookedReturn } = useContextFlightBooking();

    if (getSessionstorageItem("paymentIntent")) {
        navigate('/booking_confirmation', { state: { paymentIntent: getSessionstorageItem("paymentIntent")} });
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // No return_url here to prevent page reload. 
            },
            redirect: 'if_required', 
        });

        // const paymentIntent = await stripe.retrievePaymentIntent(clientSecret);
        // console.log(paymentIntent);

        if (result.error) {
            console.error(result.error.message);
            navigate('/');
        } else {
            console.log("id: ", bookedOutbound.data.id);
            if (bookedOutbound && Object.keys(bookedOutbound).length > 0) {
                await axios.post(`${API_URL}/booking/update_flight_booking_payment_status`,
                    {
                        created_booking_id: bookedOutbound.data.id,
                    }
                );
            }
            if (bookedReturn && Object.keys(bookedReturn).length > 0) {
                await axios.post(`${API_URL}/booking/update_flight_booking_payment_status`,
                    {
                        created_booking_id: bookedReturn.data.id,
                    }
                );
            }   
            setSessionstorageItem("paymentIntent", result.paymentIntent);
            navigate('/booking_confirmation', { state: { paymentIntent: result.paymentIntent } }); // Navigate to booking_confirmation element once payment sucessful.
        }
        setLoading(false);
    };

    // Style for PaymentElement
    const paymentElementOptions = {
        layout: {
            type: 'accordion',
            defaultCollapsed: false,
            radios: true,
            spacedAccordionItems: true
          }
      }

    return (
        <div className="payment-details">
            <div className="details-header">
                <h3>Payment</h3>
            </div>
            <div className="payment-amount">
                <b>Total amount paying: </b>
                <p className="amount">{localizationData.currency} {localizationData.currencySymbol}{numberCommas(grandTotal)}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <PaymentElement options={paymentElementOptions} />
                <button type="submit" disabled={!stripe || !elements} className="btn btn--tertiary">
                    {loading ? "Processing..." : "Pay & Confirm Booking"}
                </button>
            </form>
        </div>
    );
}

// Checkout component with stripe payment of intent creation
const BookingPayment = () => {
    const { grandTotal, bookedOutbound, bookedReturn } = useContextFlightBooking();
    const { localizationData } = useContextLocalization();
    const [clientSecret, setClientSecret] = useState(getSessionstorageItem('clientSecret') || null);

    // Creates stripe payment of intent
    useEffect(() => {
        console.log("Creating payment intent...");
        if (clientSecret) {
            return;
        }
        
        const createPaymentIntent = async () => {
            try {
                const response = await axios.post(`${API_URL}/payments/create_payment_intent`, 
                    {
                        payment: {  
                          amount: grandTotal * 100, // Amount in cents
                          currency: localizationData.currency.toLowerCase(),
                        },
                      }
                )
                if (response.data.error) {
                    console.error("Error creating payment intent: ", response.data.error);
                    return;
                } else {
                    setClientSecret(response.data.client_secret);
                    setSessionstorageItem('clientSecret', response.data.client_secret);
                    // Update the booking entry with payment_intend_id
                    if (bookedOutbound) {
                        console.log("Outbound flight booked: ", bookedOutbound);
                    }
                    if (bookedReturn) {
                        console.log("Return flight booked: ", bookedReturn);
                    }
                }
            } catch (error) {
                console.error("Error creating payment intent: ", error);
            }
        };
        createPaymentIntent();
    }, [grandTotal, localizationData.currency]);
    
    return(
        <div className="booking-details">
            <BookingTripHeader />
            <BookingFlightDetails />
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm clientSecret={clientSecret} />
                </Elements>
            )}
        </div>
    );
}

export default BookingPayment
