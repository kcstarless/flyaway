import { createContext, useContext, useState } from "react";

const ContextLoading = createContext();

export const ProviderContextLoading = ({children}) => {
    const [loadingFlightOffers, setLoadingFlightOffers] = useState(false);
    const [loadingPriceHistory, setLoadingPriceHistory] = useState(false);

    return (
        <ContextLoading.Provider value={{
            loadingFlightOffers,
            setLoadingFlightOffers,
            loadingPriceHistory,
            setLoadingPriceHistory,
        }}>
            {children}
        </ContextLoading.Provider>
    )
}

export const useContextLoading = () => useContext(ContextLoading);