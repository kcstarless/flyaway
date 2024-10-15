import { useFlightOffersContext } from '../contexts/FlightOffersContext';
import { useLocalizationContext } from '../contexts/LocalizationContext';
import { useLoadingContext } from '../contexts/LoadingContext';

const FlightflightPriceHistory = () => {
    const {flightPriceHistory, formData} = useFlightOffersContext();
    const {localizationData} = useLocalizationContext();
    const {loadingPriceHistory} = useLoadingContext();
    const currencySymbol = localizationData.currencySymbol;

    return (
        <div>
        <div className="flight-leg">{formData.departingCityName} &rarr; {formData.destinationCityName}</div>

        <div className={!loadingPriceHistory ? "flight-history" : "flight-history loading"}>
            <div className="history-title">
                {loadingPriceHistory ? (
                    <div className="loading__bar"><p>&nbsp;</p></div>
                ) : ( 
                    flightPriceHistory.length > 0 ? (
                    <p>Route Price History</p>
                ) : (
                    <p>No Price history on this route</p>
                ))}
            </div>

            <div className="history-bar">
                <div className="minimum"></div>
                <div className="first">
                    {flightPriceHistory.length > 0 ? (
                    <div className="first-price">
                        <span>{currencySymbol}{flightPriceHistory[1].amount}</span>
                    </div>
                    ) : (
                    <div className="first-price">
                        <span></span>
                    </div>
                    )}
                </div>
                <div className="medium">
                    <div className="medium-price">
                    {flightPriceHistory.length > 0 ? (
                        <>
                            <div className="dialog_box bottom">
                                {currencySymbol}{flightPriceHistory[2].amount} is typical price
                            </div>
                        </>
                        ) : (
                            <span></span> // This will render nothing if there's no amount
                        )}
                        
                    </div>
                </div>
                <div className="third">
                    <div className="third-price">
                    {flightPriceHistory.length > 0 ? (
                    <div className="first-price">
                        <span>{currencySymbol}{flightPriceHistory[3].amount}</span>
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
        </div>
    )
}

export default FlightflightPriceHistory