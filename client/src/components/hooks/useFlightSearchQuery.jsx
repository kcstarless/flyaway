// components/hooks/useFlightSearchQuery.jsx

import { useQueries } from '@tanstack/react-query';
import { fetchFlights } from '../apicalls/fetchFlights';
import { fetchFlightPriceHistory } from '../apicalls/fetchFlightPriceHistory';
// import { fetchPoI } from '../apicalls/fetchPointOfInterest';
import { useContextLoading } from '../contexts/ContextLoading';
import { useContextFlightOffers } from '../contexts/ContextFlightOffers';
import { useContextLocalization } from '../contexts/ContextLocalization';

import { useEffect, useState } from 'react';

export const useFlightSearchQuery = () => {
  const { setLoadingFlightOffers, setLoadingPriceHistory } = useContextLoading();
  const { setFlightOffers, setFlightPriceHistory, flightOffers, formData, setIsSubmitted, isSubmitted } = useContextFlightOffers(); 
  const { currencyChanged } = useContextLocalization();
  const [queryError, setQueryError] = useState(null);

  // console.log("has currency changed? ", currencyChanged.current);
  // Fetch both flight offers and activities offers only if form is submitted and currency is changed. 
  // Create a common enabled condition
  const checkCurrencyChanged = currencyChanged.current && flightOffers.length > 0;
  // console.log("Check currencychanged: ", checkCurrencyChanged);
  // console.log("Is isSubmitted", isSubmitted);
  const isEnabled = isSubmitted || checkCurrencyChanged;

  const queryResults = useQueries({
    queries: [
      {
        queryKey: ['outboundFlight', formData],
        queryFn: () => fetchFlights(formData.current),
        enabled: isEnabled,
      },
      {
        queryKey: ['flightPriceHistory', formData],
        queryFn: () => fetchFlightPriceHistory(formData.current),
        enabled: isEnabled,
      },
    ],
  });

  // Destructure outboundFlight and flightPriceHistory directly
  const [outboundFlight, flightPriceHistory] = queryResults;

  useEffect(() => {
    if (outboundFlight.isFetched && flightPriceHistory.isFetched) {
      setIsSubmitted(false);
      currencyChanged.current = false;
    }
  }, [outboundFlight.isFetched, flightPriceHistory.isFetched]);
  
  // sets data for each query. 
  useEffect(() => {
    outboundFlight.data && setFlightOffers(outboundFlight.data);
    (flightPriceHistory.data && flightPriceHistory.isFetched) ? setFlightPriceHistory(flightPriceHistory.data) : setFlightPriceHistory([]);
  
  }, [outboundFlight.data, flightPriceHistory.data]);

  // Set loading for flight and price history on loading context
  useEffect(() => {
    setLoadingFlightOffers(outboundFlight.isFetching);
    setLoadingPriceHistory(flightPriceHistory.isFetching);
  }, [outboundFlight.isFetching, flightPriceHistory.isFetching]);

  // Handle queries error(s) message
  useEffect(() => {
    if (outboundFlight.error) {
      setQueryError('Error fetching flights: ' + outboundFlight.error.message); 
      console.log(queryError);
    }
    if (flightPriceHistory.error) {
      setQueryError('Error fetching price history: ' + flightPriceHistory.error.message); 
      // console.log(querError)
    }
  }, [outboundFlight.error, flightPriceHistory.error, queryError]);

  return { outboundFlight, flightPriceHistory, queryError, queryResults }
}

