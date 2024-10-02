// general.js

export const getPagedOffers = (sortedOffers, limit = 10) => {
    return sortedOffers.slice(0, limit);
};