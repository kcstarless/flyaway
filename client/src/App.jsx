// App.jsx
import Navbar from "./components/Navbar" 
import SearchBar from "./components/Searchbar" 
import { FlightProvider } from "./contexts/FlightContext"
import FlightDisplay from "./components/FlightDisplay"
import { LocalizationProvider } from "./contexts/LocalizationContext"

function App() {
  return (
    <div className="container">
      <LocalizationProvider>
      <FlightProvider>
        <div className="header">
          <Navbar />
          <SearchBar /> 
        </div>
        <div className="content">        
            <FlightDisplay />
        </div>
      </FlightProvider>
      </LocalizationProvider>
    </div>
  )
}

export default App
