// components/hooks/useFlightSearchQuery.jsx

import { useQueries } from '@tanstack/react-query';
import { fetchFlights } from '../apicalls/fetchFlights';
import { fetchFlightPriceHistory } from '../apicalls/fetchFlightPriceHistory';
// import { fetchPoI } from '../apicalls/fetchPointOfInterest';
import { useContextLoading } from '../contexts/ContextLoading';
import { useContextFlightOffers } from '../contexts/ContextFlightOffers';

import { useEffect, useState } from 'react';

export const useFlightSearchQuery = () => {
  const { setLoadingFlightOffers, setLoadingPriceHistory } = useContextLoading();
  const { setFlightOffers, setFlightPriceHistory, formData, isSubmitted, currencyChanged } = useContextFlightOffers(); 
  const [queryError, setQueryError] = useState(null);

  // Fetch both flight offers and activities offers only if form is submitted and currency is changed. 
  // Create a common enabled condition
  const isEnabled = isSubmitted && currencyChanged;
  const queryResults = useQueries({
    queries: [
      {
        queryKey: ['outboundFlight', formData],
        queryFn: () => fetchFlights(formData),
        enabled: isEnabled,
      },
      {
        queryKey: ['flightPriceHistory', formData],
        queryFn: () => fetchFlightPriceHistory(formData),
        enabled: isEnabled,
      },
    ],
  });

  // Destructure outboundFlight and flightPriceHistory directly
  const [outboundFlight, flightPriceHistory] = queryResults;
  
  // Refetch all data
  const refetchAll = () => {
    outboundFlight.refetch();
    flightPriceHistory.refetch();
  };

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

  return { outboundFlight, flightPriceHistory, refetchAll, queryError, queryResults }
}

