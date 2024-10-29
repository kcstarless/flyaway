import React, { useState } from "react";
import { useContextLocalization } from '../contexts/ContextLocalization';
import SetLocalization from './SetLocalization';
import { useLocation } from "react-router-dom"; // Import useLocation

const Localization = () => {
    const { localizationData, localizationQuery } = useContextLocalization();
    const { country, currency, language, flag, currencySymbol } = localizationData;
    const [openLocal, setOpenLocal] = useState(false);
    const location = useLocation();
    const onFlightDetailsPage = location.pathname === "/flight_details";
    const onCheckOutPage = location.pathname === "/checkout";
    const onBookingConfirmation = location.pathname ==="/booking_confirmation"

    // Hides localization bar if on this path. 
    const hideLocalization = onFlightDetailsPage || onCheckOutPage || onBookingConfirmation;

    if (localizationQuery.isLoading) return <div className="user-local">Loading..</div>

    return (
        <>
            {hideLocalization ? null : (
            <div className="user-local" onClick={() => setOpenLocal(!openLocal)}>
                <div className="user-local-item">{language}</div>
                <div className="user-local-item">{flag ? <img src={flag} alt="country flag" className="user-local-country-flag" /> : null}</div>
                <div className="user-local-item">{country}</div>
                <div className="user-local-item">({currencySymbol}){currency}</div>

                {openLocal && <div className="dialog-backdrop" onClick={() => setOpenLocal(false)}></div>}
                <SetLocalization isOpen={openLocal} onRequestClose={() => setOpenLocal(!openLocal)} /> 
            </div>
            )}
            
        </>
    );
};

export default Localization;
