// MainContent.jsx
import { FlightBookingProvider } from "./contexts/FlightBookingContext";
import FlightSearchResultDisplay from "./display_search_result/FlightSearchResultDisplay"
import BookingDetails from "./display_selected_offer/BookingDetails";
import BookingConfirmation from "./Booking/BookingConfirmation";
import { Routes, Route } from "react-router-dom";

const MainContent = () =>{
    return (
        <FlightBookingProvider>
        <Routes>
            <Route path="/flight_search_result" element={<FlightSearchResultDisplay />} />
            <Route path="/flight_details" element={<BookingDetails />} />
            <Route path="/Booking_confirmation" element={<BookingConfirmation />} />
        </Routes> 
        </FlightBookingProvider>   
    )
}

export default MainContent