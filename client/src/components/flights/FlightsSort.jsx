// SortOptions.js
import { useContextLoading } from '../contexts/ContextLoading';

const FlightsSort = ({ sortOption, setSortOption, offersCount }) => {

    const {loadingFlightOffers} = useContextLoading();
    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    return (
        <div className="sort">
            <div className="no-results">
                {loadingFlightOffers ? (
                    <div className="loading__bar"></div>
                ) : (
                    <label>{offersCount} results</label>
                )}
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

export default FlightsSort;