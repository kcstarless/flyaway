import { useState, useRef } from "react";

const NOTICE_LOADED = 'noticeLoaded'; // Key for local storage

// Display a notice dialog on first visit to the site only
const Notice = () => {
    const [open, setOpen] = useState(true);

    if (localStorage.getItem(NOTICE_LOADED)) {
        return null;
    }

    const handleClose = () => {
        setOpen(false);
        localStorage.setItem(NOTICE_LOADED, JSON.stringify({ loaded: true }));
    }

    return (
        <>
        {open && <div className="dialog-backdrop-loading" onClick={handleClose}></div>}
        {open &&
            <dialog open className="notice-dialog">
                
                <div className="notice-header">
                    <div className="legend-header-title">Thank you for visiting Flyaway!</div> 
                    <div className="close_dialog" onClick={handleClose}><p>close <b>&#x2716;</b></p></div>                   
                </div>

                <div className="notice-detail">
                    <h5>Welcome to Flyaway!</h5>
                    <p>We appreciate your interest in Flyaway. Please be aware that this site is currently an ongoing project and under development. As a result, some features may be inaccessible.
                        Best viewed on desktop or tablet as features are not yet optimised for mobile devices.</p><br />
                        <p>This site is not designed for live/production but rather for learning and showcase purposes.</p>
                    <br />
                    
                    <h5>Geo Location Data:</h5>
                    <p>Please allow geo location access for the best experience, as geo location is used for localisation and localised contents.</p>
                    <br />
                    
                    <h5>API Limitations:</h5>
                    <p>Due to limitations with the <a href="https://developers.amadeus.com/">Amadeus API</a>, certain locations and features may not be available (e.g., points of interest). Flight search capabilities are restricted to a limited number of airports and cities. If a country, city, or airport does not appear as a suggestion, you will not be able to search for flights to or from that location, as the Amadeus API requires the city/airport/location IATA code for flight searches.</p>
                    <br />
                    
                    <h5>Examples of Known Working Cities/Airports:</h5>
                    <p>Berlin &bull; London &bull; Istanbul &bull; New York &bull; LA &bull; Shanghai &bull; Bangkok &bull; Rome &bull; Paris &bull; And more...</p>
                    <br />
                    
                    <h5>Payment:</h5>
                    <p>Payment processing is available through <a href="https://stripe.com/">Stripe</a> and is for demonstration purposes only.</p>
                    <p>Test credit card number: 4242 4242 4242 4242</p>
                    <br />
                    
                    <h5>Ongoing Improvements:</h5>
                    <p>Please note that there are several bugs and limitations I am actively working to resolve to enhance user experience.</p>
                    <br />
                    <br />
                    
                    <p>Your patience and understanding are greatly appreciated. Thank you.</p>
                    <p>Best regards,</p>
                    <br />
                    <p>Flyaway Developer</p>
                </div>
            </dialog>
        }
        </>
    );
}

export default Notice;