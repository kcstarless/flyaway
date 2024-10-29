import { useContextFlightBooking } from "../contexts/ContextFlightBooking.jsx";
import { useContextLocalization } from "../contexts/ContextLocalization.jsx";
import { STRIPE_PK_KEY, API_URL } from '../../constants.js'
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import BookingTripHeader from './BookingTripHeader.jsx';
import axios from "axios";
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Loads stripe.js 
const stripePromise = loadStripe(STRIPE_PK_KEY);

// Stripe payment element 
const PaymentForm = ({ clientSecret }) => {
    
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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


        setLoading(false);

        if (result.error) {
            console.error(result.error.message);
            // Add unsuccesful payment path here later. 
        } else {
            // Payment succeeded
            console.log("Payment successful!", result);
            navigate('/booking_confirmation', { state: { paymentIntent: result.paymentIntent } }); // Navigate to booking_confirmation element once payment sucessful.
        }
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
        <form onSubmit={handleSubmit}>
            <PaymentElement options={paymentElementOptions} />
            <button type="submit" disabled={!stripe || !elements} className="btn btn--primary">
                {loading ? "Processing..." : "Pay"}
            </button>
                {loading && <p>Loading, please wait...</p>} {/* Show loading message */}
        </form>
    );
}

// Checkout component with stripe payment of intent creation
const BookingPayment = () => {
    const { grandTotal } = useContextFlightBooking();
    const { localizationData } = useContextLocalization();
    const [clientSecret, setClientSecret] = useState("");

    // Creates stripe payment of intent
    useEffect(() => {
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
                setClientSecret(response.data.client_secret);
            } catch (error) {
                console.error("Error creating payment intent: ", error);
            }
        };
        createPaymentIntent();
    }, [grandTotal, localizationData.currency]);
    
    return(
        <>
            <BookingTripHeader />
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm clientSecret={clientSecret} />
                </Elements>
            )}
        </>
    );
}

export default BookingPayment
