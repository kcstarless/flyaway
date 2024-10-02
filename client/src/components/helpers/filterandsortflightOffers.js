// sortFlightOffers.js

export const filterFlightOffers = (filters, data) => {
    let filteredOffers = data;

    // If no filters are selected, return all data
    if (!filters.direct && !filters.oneStop && !filters.twoPlusStops && Object.keys(filters.airlines).length === 0) {
        return filteredOffers;
    }

    // Apply filters by including offers that match any of the selected filters
    filteredOffers = filteredOffers.filter(offer => {
        const isAirlineIncluded  = filters.airlines[offer.carrierName] || false;
        
        const isDirect = (filters.direct && isAirlineIncluded) && offer.stops === 0;
        const isOneStop = (filters.oneStop && isAirlineIncluded)  && offer.stops === 1;
        const isTwoPlusStops = (filters.twoPlusStops && isAirlineIncluded)  && offer.stops >= 2;


        // If any of the conditions match, include the offer
        return isDirect || isOneStop || isTwoPlusStops;
    });

    return filteredOffers;
}

export const sortFlightOffers = (sortOption, data) => {
    let sorted = [...data];

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
                const [hoursA, minutesA] = a.departureTime.split(':').map(Number);
                const [hoursB, minutesB] = b.departureTime.split(':').map(Number);
                
                const totalMinutesA = hoursA * 60 + minutesA;
                const totalMinutesB = hoursB * 60 + minutesB;

                return totalMinutesA - totalMinutesB;
            });
            break;
        case 'best':
            // Add your weighted sorting logic here
            break;
        default:
            break;
    }

    return sorted;
};
