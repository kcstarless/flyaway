import React, { useState } from "react";
import { useLocalizationContext } from '../contexts/LocalizationContext';
import SetLocalization from './SetLocalization';
import { useLocation } from "react-router-dom"; // Import useLocation

const Localization = () => {
    const { localizationData, localizationQuery } = useLocalizationContext();
    const { country, currency, language, flag, currencySymbol } = localizationData;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const location = useLocation();
    const isFlightDetailsPage = location.pathname === "/flight_details";
    // console.log(location);

    const handleModalOpen = () => {
        setModalIsOpen(true);
    };

    const handleModalClose = () => {
        setModalIsOpen(false);
    };

    if (localizationQuery.isLoading) return <div className="user-local">Loading..</div>

    return (
        <>
            {isFlightDetailsPage ? null : (
            <div className="user-local" onClick={handleModalOpen}>
                <div className="user-local-item">{language}</div>
                <div className="user-local-item">{flag ? <img src={flag} alt="country flag" className="user-local-country-flag" /> : null}</div>
                <div className="user-local-item">{country}</div>
                <div className="user-local-item">({currencySymbol}){currency}</div>
            </div>
            )}
            <SetLocalization isOpen={modalIsOpen} onRequestClose={handleModalClose} />
        </>
    );
};

export default Localization;
