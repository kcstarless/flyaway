// MainContent.jsx
import FlightSearchResultDisplay from "./display_search_result/FlightSearchResultDisplay"
import BookingDetails from "./display_selected_offer/BookingDetails";
import { Routes, Route } from "react-router-dom";

const MainContent = () =>{
    return (
        <Routes>
            <Route path="/flight_search_result" element={<FlightSearchResultDisplay />} />
            <Route path="/flight_details" element={<BookingDetails />} />
        </Routes>    
    )
}

export default MainContent