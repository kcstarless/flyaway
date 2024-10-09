import { useFlightOffersContext } from '../contexts/FlightOffersContext';
import { useLocalizationContext } from '../contexts/LocalizationContext';
import { useLoadingContext } from '../contexts/LoadingContext';

const FlightflightPriceHistory = () => {
    const {flightPriceHistory, returnPriceHistory, selectedOutboundFlight} = useFlightOffersContext();
    const {localizationData} = useLocalizationContext();
    const {loadingPriceHistory} = useLoadingContext();
    const currencySymbol = localizationData.currencySymbol;

    const priceHistory = selectedOutboundFlight === null ? flightPriceHistory : returnPriceHistory;

    return (
        <div className="flight-history">
            <div className="history-title">
                {loadingPriceHistory ? (
                    <div className="loading__bar"><p>&nbsp;</p></div>
                ) : ( 
                    priceHistory.length > 0 ? (
                    <p>Route Price History</p>
                ) : (
                    <p>No Price history on this route</p>
                ))}
            </div>

            <div className="history-bar">
                <div className="minimum"></div>
                <div className="first">
                    {priceHistory.length > 0 ? (
                    <div className="first-price">
                        <span>{currencySymbol}{priceHistory[1].amount}</span>
                    </div>
                    ) : (
                    <div className="first-price">
                        <span></span>
                    </div>
                    )}
                </div>
                <div className="medium">
                    <div className="medium-price">
                    {priceHistory.length > 0 ? (
                        <>
                            <div className="dialog_box bottom">
                                {currencySymbol}{priceHistory[2].amount} is typical price
                            </div>
                        </>
                        ) : (
                            <span></span> // This will render nothing if there's no amount
                        )}
                        
                    </div>
                </div>
                <div className="third">
                    <div className="third-price">
                    {priceHistory.length > 0 ? (
                    <div className="first-price">
                        <span>{currencySymbol}{priceHistory[3].amount}</span>
                    </div>
                    ) : (
                    <div className="first-price">
                        <span></span>
                    </div>
                    )}
                    </div>
                </div>
                <div className="maximum"></div>
            </div>
        </div>
    )
}

export default FlightflightPriceHistory