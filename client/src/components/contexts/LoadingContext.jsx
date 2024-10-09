import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({children}) => {
    const [loadingFlightOffers, setLoadingFlightOffers] = useState(false);
    const [loadingPriceHistory, setLoadingPriceHistory] = useState(false);

    return (
        <LoadingContext.Provider value={{
            loadingFlightOffers,
            setLoadingFlightOffers,
            loadingPriceHistory,
            setLoadingPriceHistory,
        }}>
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoadingContext = () => useContext(LoadingContext);