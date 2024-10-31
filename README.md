# Project: Flyaway

## Description
Allows user to search flights based on origin, destination and date. My goal for this project was to see how React can work with Rails.
APP uses Rails as a backend API and React as frontend. This separates app into two which communicates via API requests. This approach allows you to decouple the frontend and backend enable it to operate independently. 

No libraries was used to start with but as project expanded I have tried and implemented different libraries for better coding experience. 

## Vite + React + SASS
For this project I will be using Vite for javascript bundler with React and Sass.
I thought about using Vue.js instead of React but I am still learning React so decided to spend more time on it. 
Sass is my go to CSS as I like was it's structured and able to separate different components.

## Authentication React -> Rails
Access Token: When a user signs in, they receive an accessToken, which is used to authenticate requests to protected resources. This token usually has a short expiration time (e.g., minutes).

Refresh Token: Along with the accessToken, the user also receives a refreshToken. This token is used to obtain a new accessToken when the original one expires without requiring the user to log in again.

Typical Flow:
Initial Sign-In: The user provides their credentials, and upon successful sign-in, they receive both an accessToken and a refreshToken.
Making Authenticated Requests: The application uses the accessToken to authenticate requests to the API.
Token Expiration: Once the accessToken expires, the application uses the refreshToken to request a new accessToken.
Handling Refresh: If the refreshToken is valid, the server issues a new accessToken. This can happen seamlessly in the background without requiring the user to log in again.
Sign Out: When the user signs out, the application clears both tokens from storage.
Implementation Steps:
Store the refreshToken: You should store the refreshToken in localStorage (or a more secure method like an HttpOnly cookie) to use it for fetching new accessTokens.
Handle Token Refreshing: Create a function that checks if the accessToken is expired and, if so, uses the refreshToken to get a new one.
Call Refresh Token Endpoint: Implement the API call to the endpoint responsible for refreshing the tokens, which might look something like this:


## Stripe payment
Payment is processed using Stripe specifically stripe element. I first wanted to use stripe-hosted page for payment for simplicity sake but I realise this approach needs pre created product/price on stripe to work. So this approached is won't work as there are many flight with varied prices. So I had to go with second option which was to create custom payment flow. Where final price calculate on the server side and push to front end then to stripe.

During testing environment I required Ngrok to allow testing of webhook over https for stripe

Rails API was used to create stripe payment of intent (`client_secret`) and React handles the user payment through stripe's `confirmPayment` method. 
## Material UI
I tried using minimal MUI to start with but after and instead try to build my own. But after trying to create auto complete in Javascript/React and seeing how much time it consumed (I got faster but still) I decided to use MUI for following components.
- Departure time and flight duration slider.

## React libraries
- react-icons: I like the fact that I can directly use css to style the icons with cluttering the return statement with svg file path or changing color `fill` individually on file it self. 
- react-hook-form: Decided to try this one out for better form building experience.

- React-actioncable-provider for ActionCable interaction between Rails and react. 



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
Amadeus API limitation - limited cached data for all api calls.

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





# syntax = docker/dockerfile:1

# Make sure RUBY_VERSION matches the Ruby version in .ruby-version and Gemfile
ARG RUBY_VERSION=3.2.2
FROM registry.docker.com/library/ruby:$RUBY_VERSION-slim as base

# Rails app lives here
WORKDIR /rails

# Set production environment
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build gems
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libpq-dev libvips pkg-config

# Install application gems
COPY Gemfile Gemfile.lock ./
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/


# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libvips postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built artifacts: gems, application
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails

# Run and own only the runtime files as a non-root user for security
RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails db log storage tmp
USER rails:rails

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD ["./bin/rails", "server"]
