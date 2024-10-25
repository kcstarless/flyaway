import React, { useState } from "react";
import { useLocalizationContext } from '../contexts/LocalizationContext';
import SetLocalization from './SetLocalization';
import { useLocation } from "react-router-dom"; // Import useLocation

const Localization = () => {
    const { localizationData, localizationQuery } = useLocalizationContext();
    const { country, currency, language, flag, currencySymbol } = localizationData;
    const [openLocal, setOpenLocal] = useState(false);
    const location = useLocation();
    const isFlightDetailsPage = location.pathname === "/flight_details";
    // console.log(location);

    if (localizationQuery.isLoading) return <div className="user-local">Loading..</div>

    return (
        <>
            {isFlightDetailsPage ? null : (
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
