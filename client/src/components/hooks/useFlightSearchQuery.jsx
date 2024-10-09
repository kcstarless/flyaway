// useFlightSearchQuery.jsx

import { useQueries } from '@tanstack/react-query';
import { fetchFlights } from '../apicalls/fetchFlights';
import { fetchFlightPriceHistory } from '../apicalls/fetchFlightPriceHistory';
// import { fetchPoI } from '../apicalls/fetchPointOfInterest';
import { useLoadingContext } from '../contexts/LoadingContext';
import { useFlightOffersContext } from '../contexts/FlightOffersContext';

import { useEffect, useState } from 'react';

export const useFlightSearchQuery = (formData, isSubmitted, currencyChanged) => {
  const { setLoadingFlightOffers, setLoadingPriceHistory } = useLoadingContext();
  const { setFlightOffers, setFlightPriceHistory } = useFlightOffersContext(); 
  const [queryError, setQueryError] = useState(null);

// Fetch both flight offers and activities offers only if form is submitted and currency is changed. 
// Create a common enabled condition
const isEnabled = isSubmitted && currencyChanged && formData.departingIATA && !!formData.destinationIATA;
const queryResults = useQueries({
  queries: [
    {
      queryKey: ['outboundFlight', formData],
      queryFn: () => fetchFlights(formData, false),
      enabled: isEnabled,
    },
    {
      queryKey: ['flightPriceHistory', formData],
      queryFn: () => fetchFlightPriceHistory(formData, false),
      enabled: isEnabled,
    },
  ],
});

// Destructure outboundFlight and flightPriceHistory directly
const [outboundFlight, flightPriceHistory] = queryResults;
  
  // if (isReturn) console.log(returnFlight.data);
  // Refetch all data
  const refetchAll = () => {
    outboundFlight.refetch();
    flightPriceHistory.refetch();
  };

  // isReturn && console.log(returnFlight.data[0]);

  // sets data for each query. 
  useEffect(() => {
    outboundFlight.data && setFlightOffers(outboundFlight.data);
    flightPriceHistory.data && setFlightPriceHistory(flightPriceHistory.data)
  
  }, [outboundFlight.data, flightPriceHistory]);

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

  return { outboundFlight, flightPriceHistory, refetchAll, queryError }
}

