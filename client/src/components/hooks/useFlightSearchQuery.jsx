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
  const { setFlightOffersData, setPriceHistory } = useFlightOffersContext(); 
  const [queryError, setQueryError] = useState(null);

  // console.log(formData);
  // Fetch both flight offers and activities offers only if form is submitted and currency is changed. 
  const queryOffers = useQueries({
    queries: [
      {
        queryKey: ['flights', formData],
        queryFn: () => fetchFlights(formData),
        enabled: isSubmitted && currencyChanged && formData.departingIATA && !!formData.destinationIATA,
      },
      // {
      //   queryKey: ['activities', formData],
      //   queryFn: () => fetchPoI(formData), 
      //   enabled: isSubmitted && currencyChanged && formData.departingIATA && !!formData.destinationIATA,
      // },
      {
        queryKey: ['priceHistory', formData],
        queryFn: () => fetchFlightPriceHistory(formData),
        enabled: isSubmitted && currencyChanged && formData.departingIATA && !!formData.destinationIATA,
      }
    ],
  });

  const [flights, priceHistory] = queryOffers; // Deconstruction of queries. 

  // Refetch all data
  const refetchAll = () => {
    flights.refetch();
    priceHistory.refetch();
  };

  // sets data for each query. 
  useEffect(() => {
    flights.data && setFlightOffersData(flights.data);
    priceHistory.data ? setPriceHistory(priceHistory.data) : setPriceHistory([]);
  
  }, [flights.data, setFlightOffersData, priceHistory.data, setPriceHistory]);

  // Set loading for flight and price history on loading context
  useEffect(() => {
    setLoadingFlightOffers(flights.isLoading);
    setLoadingPriceHistory(priceHistory.isLoading);
  }, [flights.isLoading, priceHistory.isLoading, setLoadingFlightOffers, setLoadingPriceHistory]);

  // Handle queries error(s) message
  useEffect(() => {
    if (flights.error) {
      setQueryError('Error fetching flights: ' + flights.error.message); 
      console.log(queryError);
    }
    if (priceHistory.error) {
      setQueryError('Error fetching price history: ' + priceHistory.error.message); 
      // console.log(querError)
    }
  }, [flights.error, priceHistory.error, queryError]);

  return { flights, priceHistory, refetchAll, queryError }
}

