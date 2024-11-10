import { useContextFlightOffers } from '../contexts/ContextFlightOffers';
import { useContextLocalization } from '../contexts/ContextLocalization';
import { useContextLoading } from '../contexts/ContextLoading';
import { validCurrency, numberCommas } from '../helpers/general';
import { toolTipHelper } from '../helpers/toolTipHelper';
import Tooltip from '@mui/material/Tooltip';
import { CiCircleInfo } from "react-icons/ci";

const FlightsPriceHistory = () => {
    const {flightPriceHistory, formData} = useContextFlightOffers();
    const {localizationData} = useContextLocalization();
    const {loadingPriceHistory} = useContextLoading();
    const currencySymbol = localizationData.currencySymbol;
    const currencyValid = validCurrency.includes(localizationData.currency);

    return (
        <div>
        <div className="flight-leg">{formData.current.departingCityName} &rarr; {formData.current.destinationCityName}</div>

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
                        {currencyValid && <span>{currencySymbol}{numberCommas(flightPriceHistory[1].amount)}</span>}
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
                            {currencyValid
                                ? (<div>{currencySymbol}{numberCommas(flightPriceHistory[2]?.amount)} is typical price</div>) 
                                : (<div>currency {currencySymbol} not supported. <Tooltip  placement="top-start" title={toolTipHelper("price_history")}><div><CiCircleInfo /></div></Tooltip></div>)
                            }
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
                        {currencyValid && <span>{currencySymbol}{numberCommas(flightPriceHistory[3].amount)}</span>}
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

export default FlightsPriceHistory