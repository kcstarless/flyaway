// App.jsx
import Navbar from "./components/Navbar" 
import SearchBar from "./components/Searchbar" 
import MainContent from "./components/MainContent"

function App() {
  return (
    <div className="container">
      <Navbar />
      <SearchBar />
      <MainContent />
      {/* <Footer />  */}
    </div>
  )
}

export default App
