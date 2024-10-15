// sortFlightOffers.js
import { hhmm24ToMinutes } from "./general";

// Filters data based on filter (eg. direct, airline)
export const filterFlightOffers = (filters, data) => {
    let filteredOffers = data;
    // console.log(filteredOffers[0])

    // If no filters are selected, return all data
    if (!filters.direct && !filters.oneStop && !filters.twoPlusStops && Object.keys(filters.airlines).length === 0) {
        return filteredOffers;
    }

    // Apply filters by including offers that match any of the selected filters
    filteredOffers = filteredOffers.filter(offer => {
        const minutes = hhmm24ToMinutes(offer.departureTime); // departure time to minutes
        const duration = offer.duration[1];
        // console.log(duration);

        const isInTimeRange = (minutes >= filters.departTimeRange[0] && minutes <= filters.departTimeRange[1]) || false;
        const isInTravelTimeRange = (duration <= filters.travelTime) || false;
        const isAirlineIncluded  = filters.airlines[offer.carrierName] || false;
        
        const isDirect = (filters.direct && isAirlineIncluded && isInTimeRange && isInTravelTimeRange) && offer.stops === 0;
        const isOneStop = (filters.oneStop && isAirlineIncluded && isInTimeRange && isInTravelTimeRange)  && offer.stops === 1;
        const isTwoPlusStops = (filters.twoPlusStops && isAirlineIncluded && isInTimeRange && isInTravelTimeRange)  && offer.stops >= 2;


        // If any of the conditions match, include the offer
        return isDirect || isOneStop || isTwoPlusStops;
    });

    return filteredOffers;
}


// Sorts data based on sortOption(eg cheapest price)
export const sortFlightOffers = (sortOption, data) => {
    let sorted = [...data];

    if (sorted.length === 0) return sorted; // Return if no data

    const minPrice = Math.min(...sorted.map(offer => offer.price));
    const maxPrice = Math.max(...sorted.map(offer => offer.price));
    const minDuration = Math.min(...sorted.map(offer => offer.duration[1]));
    const maxDuration = Math.max(...sorted.map(offer => offer.duration[1]));
    const minStops = Math.min(...sorted.map(offer => offer.stops));
    const maxStops = Math.max(...sorted.map(offer => offer.stops));

    // Best sorting weights
    const weights = {
        price: 0.5,
        duration: 0.4,
        stops: 0.1
    }

    // Normalise the best sorting criteria
    function normalizeValue(value, min, max) {
        return (value - min) / (max - min);
    }

    // Calculates scores of each offer
    function calculateScore(offer) {
        const priceScore = normalizeValue(offer.price, minPrice, maxPrice) * weights.price;
        const durationScore = normalizeValue(offer.duration[1], minDuration, maxDuration) * weights.duration;
        const stopsScore = normalizeValue(offer.stops, minStops, maxStops) * weights.stops;

        const totalScore = priceScore + durationScore + stopsScore;

        // Debugging: log each score calculation
        // console.log(`Offer: ${offer.carrierName}, Price Score: ${priceScore}, Duration Score: ${durationScore}, Stops Score: ${stopsScore}, Total Score: ${totalScore}`);

        return totalScore;
    }

    switch (sortOption) {
        case 'price':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'fastest':
            sorted.sort((a, b) => {
                return a.duration[1] - b.duration[1] || a.price - b.price;
            });
            break;
        case 'departure-time':
            sorted.sort((a, b) => {
                const totalMinutesA = hhmm24ToMinutes(a.departureTime)
                const totalMinutesB = hhmm24ToMinutes(b.departureTime)

                return totalMinutesA - totalMinutesB;
            });
            break;
        case 'best':
            sorted.sort((a, b) => {
                const scoreA = calculateScore(a);
                const scoreB = calculateScore(b);
                return scoreA - scoreB;
            })
            // Add your weighted sorting logic here
            break;
        default:
            break;
    }

    return sorted;
};
