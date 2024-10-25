// App.jsx
import Navbar from "./components/Navbar" 
import SearchBar from "./components/Searchbar" 
import { FlightOffersProvider } from "./components/contexts/FlightOffersContext"
import { LocalizationProvider } from "./components/contexts/LocalizationContext"
import { UserSessionProvider } from "./components/contexts/UserSessionContext"
import { LoadingProvider } from "./components/contexts/LoadingContext"
import MainContent from "./components/MainContent"
import { BrowserRouter as Router } from "react-router-dom";

// import ErrorBoundary from "./components/ErrorBoundary"
// import TempContainer from "./components/TempContainer"

function App() {
  return (
    <Router>
      <div className="container">
        <UserSessionProvider>
        <LocalizationProvider>
        <FlightOffersProvider>
        <LoadingProvider>
          <div className="c1">
            <div className="header">
              <Navbar />
              <SearchBar />
            </div>
          </div>

          <div className="c2">  
            <div className="content">
                <MainContent />
            </div>
          </div>
        </LoadingProvider>
        </FlightOffersProvider>
        </LocalizationProvider>
        </UserSessionProvider>
      </div>
    </Router>
  )
}

export default App
