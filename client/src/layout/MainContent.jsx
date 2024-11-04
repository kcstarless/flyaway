// layout/MainContent.jsx

import DisplayFlights from "../components/flights/_DisplayFlights";
import DisplayBooking from "../components/booking/_DisplayBooking";
import BookingConfirmation from "../components/booking/BookingConfirmation";
import BookingPayment from "../components/booking/BookingPayment";
import Mainpage from "../components/maincontent/MainPage";
import { Routes, Route } from "react-router-dom";

const MainContent = () =>{
    return (
        <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/flight_search_result" element={<DisplayFlights />} />
            <Route path="/flight_details" element={<DisplayBooking />} />
            <Route path="/checkout" element={<BookingPayment />} />
            <Route path="/booking_confirmation" element={<BookingConfirmation />} />
        </Routes> 
    )
}

export default MainContent