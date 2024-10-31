// App.jsx
import Navbar from "./layout/Navbar" 
import SearchBar from "./layout/Searchbar" 
import MainContent from "./layout/MainContent"
import { ProviderContextFlightOffers } from "./components/contexts/ContextFlightOffers"
import { ProviderContextFlightBooking } from "./components/contexts/ContextFlightBooking"
import { ProviderLocalization } from "./components/contexts/ContextLocalization"
import { ProviderContextUserSession } from "./components/contexts/ContextUserSession"
import { ProviderContextLoading } from "./components/contexts/ContextLoading"

import { BrowserRouter as Router } from "react-router-dom";


// import ErrorBoundary from "./components/ErrorBoundary"
// import TempContainer from "./components/TempContainer"

function App() {
  return (
    <Router>
      <div className="container">
        <ProviderContextUserSession>
        <ProviderLocalization>
        <ProviderContextFlightOffers>
        <ProviderContextFlightBooking>
        <ProviderContextLoading>
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
        </ProviderContextLoading>
        </ProviderContextFlightBooking>
        </ProviderContextFlightOffers>
        </ProviderLocalization>
        </ProviderContextUserSession>
      </div>
    </Router>
  )
}

export default App

