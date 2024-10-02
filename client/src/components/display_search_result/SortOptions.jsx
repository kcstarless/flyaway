// SortOptions.js
import React from 'react';

const SortOptions = ({ sortOption, setSortOption, offersCount }) => {
    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    return (
        <div className="sort">
            <div className="no-results">
                <label>{offersCount} results</label>
            </div>
            <div className="sort-selection">
                <label>Sort by</label>
                <select className="sort-by" value={sortOption} onChange={handleSortChange}>
                    <option value="best">Best</option>
                    <option value="price">Cheapest first</option>
                    <option value="fastest">Fastest first</option>
                    <option value="departure-time">Departure time</option>
                </select>
            </div>
        </div>
    );
};

export default SortOptions;