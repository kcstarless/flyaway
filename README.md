# Project: Flyaway

## Description
Allows user to search flights based on origin, destination and date. My goal for this project was to see how React can work with Rails.
APP uses Rails as a backend API and React as frontend. This separates app into two which communicates via API requests. This approach allows you to decouple the frontend and backend enable it to operate independently. 

## Vite + React + SASS
For this project I will be using Vite for javascript bundler with React and Sass.
I thought about using Vue.js instead of React but I am still learning React so decided to spend more time on it. 
Sass is my go to CSS as I like was it's structured and able to separate different components. 

## Material UI
I tried using minimal MUI to start with but after and instead try to build my own. But after trying to create auto complete in Javascript/React and seeing how much time it consumed (I got faster but still) I decided to use MUI for following components.
- Departure time and flight duration slider. 

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

[OpenCage Geocoder](https://opencagedata.com/) is used for collecting user location data. I could have used IP based location finder but I decided to go with geolocation for possible expansion allowing user to use map to set origin and destiantion.

[Restcountries](https://restcountires.com) is used to collect related country data from opencage for country language and country flag. 

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
- React modal
- TanStack Query
- Material UI
    - Slider, Box

## Testing


                        itinerary.segments.map((segment, segIndex) => (

                                <div>
                                    <p><img src={`https://www.gstatic.com/flights/airline_logos/70px/${segment.operating.carrierCode}.png`}
                                            className="airline-logo"
                                            alt="Airline Logo" />
                                    {(segment.airlineName)}
                                    </p>
                                    <p>{segment.operating.carrierCode}{segment.number}</p>
                                </div>

                                <div>
                                    <p>{segment.departure.iataCode} at {segment.departure.at}</p>
                                </div>

                                <div>
                                    <p>Duration: {itinerary.duration}</p>
                                    <p>Stops: {getNumberOfStops(offer.itineraries)}</p>
                                </div>

                                <div>
                                    <p>Arrival: {segment.arrival.iataCode} at {segment.arrival.at}</p>
                                </div>
                                
                                <div>
                                    <p>Total Price: {offer.price.total} {offer.price.currency}</p>
                                </div>
                        </div>
                        ))
                    ))