import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/application.sass.scss'
import Modal from 'react-modal'; // Import Modal

// Set the app element
Modal.setAppElement('#root'); // Replace '#root' with your app's main container ID

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
