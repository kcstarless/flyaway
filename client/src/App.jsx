// App.jsx
import Navbar from "./components/Navbar" 
import SearchBar from "./components/Searchbar" 
import { FlightOffersProvider } from "./components/contexts/FlightOffersContext"
import { LocalizationProvider } from "./components/contexts/LocalizationContext"
import { LoadingProvider } from "./components/contexts/LoadingContext"
import FlightSearchResultDisplay from "./components/FlightSearchResultDisplay"
import ErrorBoundary from "./components/ErrorBoundary"
// import TempContainer from "./components/TempContainer"

function App() {
  return (
    <div className="container">
      <LocalizationProvider>
      <FlightOffersProvider>
      <LoadingProvider>
        <div className="c1">
          <div className="header">
            <Navbar />
            <ErrorBoundary>
            <SearchBar />
            </ErrorBoundary>
          </div>
        </div>

        <div className="c2">  
          <div className="content"> 
              {/* <TempContainer />         */}
              <FlightSearchResultDisplay />
          </div>
        </div>
      </LoadingProvider>
      </FlightOffersProvider>
      </LocalizationProvider>
    </div>
  )
}

export default App
