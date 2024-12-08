# Project: Flyaway

## Description
Allows user to search flights based on origin, destination and date. My goal for this project was to see how React can work with Rails.
APP uses Rails as a backend API and React as frontend. This separates app into two which communicates via API requests. This approach allows you to decouple the frontend and backend enable it to operate independently. 

No libraries was used to start with but as project expanded I have tried and implemented different libraries for better coding experience. 

## Vite + React + SASS
For this project I will be using Vite for javascript bundler with React and Sass.
I thought about using Vue.js instead of React but I am still learning React so decided to spend more time on it. 
Sass is my go to CSS as I am more familiar with it and give me more control over tailwind CSS. 

## Amadeus API GDS, Gobal Distribution System
Flight information and booking process will be handle by [Amadeus API](https://developers.amadeus.com/). Amadeus is one of big three flight/travel GDS which provide real time flight information data. The app will be running on <i>test environment</i> which has some limitations as Amadeus provides limited data collections and most uses static cached data in this mode.  

### Step-by-step: flight booking process
1. <b>Search for flights</b> - Using `Flight Offers Search API` endpoint to search for flights based on users desired criteria.
2. <b>Confirm availability and fare</b> - Selected flight offer must be locked in with `Flight Offers Price API` as airfare fluctuates. During this process you add aditional function like extra bags or legroom can be purchased on top of flight ticket. 
3. <b>Making a booking</b> - Once fare is confirmed booking is made using `Flight Create Orders API`. This creates <i>Passenger Name Record</i>, a unique identifier which contains reservation data like passenger information and itinerary details. 
4. <b>Complete payment<b> - Payment is handle using either Amamdeus airline consolidators (acting as broker) for non-accredited agents and through BSP (Billing and Settlement Plan) or ARC (Airline Reporting Corporation) for accredited agents. 
5. <b>Issue a ticket</b> - Once payment and booking is logged ticket will be issued by accredited agents or consolidators.

Note. In this app payment is handle by using [Stripe](https://stripe.com/) and I have combined the step <b>3, 4 and 5<b> into one as I won't be using accredited agents or consolidators. 


## Authentication React -> Rails
[Devise-API](https://github.com/nejdetkadir/devise-api) provide `JSON Web Token (JWT)` stateless authentication. Whenever validation is required `headers: { Authorization: "Bearer ${accessToken} }` is passed in as parameter from React to Rails api, where devise-api ensure validity of the token. 

Access Token: When a user signs in, they receive an accessToken, which is used to authenticate requests to protected resources. This token usually has a short expiration time (e.g., minutes).

Refresh Token: Along with the accessToken, the user also receives a refreshToken. This token is used to obtain a new accessToken when the original one expires without requiring the user to log in again.

### Typical Flow Authentication Flow
- `Initial Sign-In:` The user provides their credentials, and upon successful sign-in, they receive both an accessToken and a refreshToken.
- `Making Authenticated Requests:` The application uses the accessToken to authenticate requests to the Rails Backend API.
- `Token Expiration:` Once the accessToken expires, the application uses the refreshToken to request a new accessToken.
- `Handling Refresh:` If the refreshToken is valid, the server issues a new accessToken. This can happen seamlessly in the background without requiring the user to log in again.
- `Sign Out:` When the user signs out, the application clears both tokens from storage.
Implementation Steps:
- `Store the refreshToken:` You should store the refreshToken in localStorage (or a more secure method like an HttpOnly cookie) to use it for fetching new accessTokens.
- `Handle Token Refreshing:` Create a function that checks if the accessToken is expired and, if so, uses the refreshToken to get a new one.
- `Call Refresh Token Endpoint:` Implement the API call to the endpoint responsible for refreshing the tokens, which might look something like this:

`Guest` and `Registered` users both have full access with exception that `guest` user won't be able to access booking.
`Registered` user will be able to view their bookings history and UI will display any upcoming flight on the user dialog box. 


## Stripe payment
Payment is processed using Stripe specifically stripe element. I first wanted to use stripe-hosted page for payment for simplicity sake but I realise this approach needs pre created product/price on stripe to work. So this approached won't work as there are many flight with varied prices. So I had to go with second option which was to create custom payment flow. Where final price calculate on the server side and push to front end then to stripe.

During testing environment I required Ngrok to allow testing of webhook over https for stripe

Rails API was used to create stripe payment of intent (`client_secret`) and React handles the user payment through stripe's `confirmPayment` method. 

## API requests
Rails will handle all API request and React will use it to provide Real-time Feedback, eg destination location in flight search.

#### Example request flow is as follow:
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
[Amadeus API](https://www.flightapi.io/flight-status-and-tracking-api) to grab all flight and travel related information.
Including airports, airliner, flight schedule, local activities and more. 

[OpenCage Geocoder](https://opencagedata.com/) is used for collecting user location data. I could have used IP based location finder but I decided to go with geolocation for possible expansion allowing user to use map to set origin and destiantion.

[Restcountries](https://restcountires.com) is used to collect related country data from opencage for country language and country flag. 

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

## Testing

## Issues
<ins>Amadeus Ruby API endpoint</ins><br>
Flight_Offer search is very unstable. Rework was needed to use faraday to make custom API calls. 

<ins>404 Error with React Routes</ins><br>
Because Rails server doesnt recognize React's client-side routes. I needed to create `Catch-All` routes for non Rails API routes to serve index.html when routes is not recognised(if page is refreshed while in React Route, Rails won't recognise the route path therefore giving 404 error). This involved few steps as I found out. 

1. Create new controllers to serve and render `index.html`. 
- `ApplicationController` inherits from `ActionController::API` serving only API requests. 
- `StaticBaseController` inherits from `ActionController::Base` for rendering HTML views
- `StaticController` inherits from `StaticBaseController` and renders index.html from `/public` as follow: 
```
  def index
    render file: Rails.root.join('public', 'index.html'), layout: false
  end
```

2. Create a new route to catch-all routes for React frontend
- This route ensures that any non-API routes are handled by the React frontend.
```
  get '*path', to: 'static#index', constraints: ->(request) { !request.xhr? && request.path.exclude?('/api') }
```

<ins>Persistant data</ins><br>
During the booking process all booking related data including user input is stored in local session. This approach was neeeded in order tackle browser refresh and back event to prevent app from breaking. If the session data exist app will use this data. For example, if payment is made and booking is confirmed app will check for these events stored in session data and if it exist it will prevent user making another payment when user clicks browser back or refresh button. 


