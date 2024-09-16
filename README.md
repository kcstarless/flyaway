# Project: Flyaway

## Description
Allows user to search flights based on origin, destination and date. My goal for this project was to see how React can work with Rails.
APP uses Rails as a backend API and React as frontend. This separates app into two which communicates via API requests. This approach allows you to decouple the frontend and backend enable it to operate independently. 

## Vite + React + SASS
For this project I will be using Vite for javascript bundler with React and Sass.
I thought about using Vue.js instead of React but I am still learning React so decided to spend more time on it. 
Sass is my go to CSS as I like was it's structured and able to separate different components. 

## API requests
Rails will handle all API request and React will use it to provide Real-time Feedback, eg destination location in flight search.

Example request flow is as follow:
1. User interact with React:
    - The user types a keyword (eg. "sy" for "Sydney") in an input field
    - React frontend(`client`) makes a GET request to the Rails backend.
2. Rails backend handles the request:
    - The Rails API receives the query parameter "sy" and then sends a request to Amadeus API to fetch matching location. 
    - Rails processes the response and extracts the necessary data (eg. airport names, city names, IATA codes and etc). And returns the data as a JSON to React. 
3. React Receives the response:
    - React dynamically updates the UI displaying the list of suggested locations in real-time based on the user's input. 

I have decided on this approach instead of React directly making request to external APIs due to security, data processing and error handling. 

## API dependencies
This app will be using [Amadeus API](https://www.flightapi.io/flight-status-and-tracking-api) to grab all flight and travel related information.
Including airports, airliner, flight schedule and etc. 

## DB dependencies
Using PostgreSQL for DB of choice. Us

## Gem dependencies
- Devise
- Simple form
- faker 
- figaro
- faraday
- amadeus
- dotenv-rails

## React Library dependencies
- React datepicker

## Testing



        {
            "type": "amadeusOAuth2Token",
            "username": "jwgim7786@gmail.com",
            "application_name": "flyaway",
            "client_id": "FquaEGZKzrLdivgG84JlIJBHFTNYIfw4",
            "token_type": "Bearer",
            "access_token": "9FbNEcr37THhe0VShC1DA3vhG8a5",
            "expires_in": 1799,
            "state": "approved",
            "scope": ""
        }

        import { useState, useEffect } from 'react';
import axios from 'axios';

function LocationSearch() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Debounce delay in milliseconds
    const debounceDelay = 300;

    // Debounce effect to limit the number of API calls
    useEffect(() => {
        const debounce = setTimeout(() => {
            if (query.length > 1) {
                fetchSuggestions(query);
            }
        }, debounceDelay);

        return () => clearTimeout(debounce); // Cleanup
    }, [query]);

    const fetchSuggestions = async (searchQuery) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/v1/search/locations`, {
                params: { query: searchQuery }
            });
            setSuggestions(response.data.locations);
        } catch (error) {
            console.error('Error fetching location suggestions:', error);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Origin..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {isLoading && <p>Loading...</p>}
            <ul>
                {suggestions.map((location) => (
                    <li key={location.code}>{location.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default LocationSearch;
