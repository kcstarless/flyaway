Rails.application.routes.draw do
  # Devise routes for user authentication
  devise_for :users

  # API routes should be in /api/v1
  namespace :api do
    namespace :v1 do
      # Search-related routes
      get 'search/airport_city',           to: 'search#airport_city'
      get 'search/geocode',                to: 'search#geocode'
      get 'search/geocode_destination',    to: 'search#geocode_destination'
      get 'search/airline',                to: 'search#airline'
      get 'search/flight_history',         to: 'search#flight_history'
      get 'search/location_by_iata',       to: 'search#location_by_iata'
      get 'search/airport_iata/:iataCode', to: 'search#airport_iata'

      post 'search/flight_offers',         to: 'search#flight_offers'
      post 'search/poi_offers',            to: 'search#poi_offers'
      post 'search/pricing',               to: 'search#pricing'

      # Booking-related routes
      post 'booking/book_flight',          to: 'booking#book_flight'
    end
  end
end
