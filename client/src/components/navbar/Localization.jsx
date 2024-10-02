import React, { useState } from "react";
import { useLocalizationContext } from '../contexts/LocalizationContext';
import SetLocalization from './SetLocalization';

const Localization = () => {
    const { localizationData, localizationQuery } = useLocalizationContext();
    const { country, currency, language, flag, currencySymbol } = localizationData;
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleModalOpen = () => {
        setModalIsOpen(true);
    };

    const handleModalClose = () => {
        setModalIsOpen(false);
    };

    if (localizationQuery.isLoading) return <div className="user-local">Loading..</div>

    return (
        <>
            <div className="user-local" onClick={handleModalOpen}>
                <div className="user-local-item">{language}</div>
                <div className="user-local-item">{flag ? <img src={flag} alt="country flag" className="user-local-country-flag" /> : null}</div>
                <div className="user-local-item">{country}</div>
                <div className="user-local-item">({currencySymbol}){currency}</div>
            </div>
            <SetLocalization isOpen={modalIsOpen} onRequestClose={handleModalClose} />
        </>
    );
};

export default Localization;
