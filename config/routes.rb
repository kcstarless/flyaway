Rails.application.routes.draw do
  # Devise routes for user authentication
  devise_for :users

  # ActionCable routes
  mount ActionCable.server => '/cable'

  # API routes should be in /api/v1
  namespace :api do
    namespace :v1 do
      # Search-related routes
      get 'search/airport_city',              to: 'search#airport_city'
      get 'search/geocode',                   to: 'search#geocode'
      get 'search/geocode_destination',       to: 'search#geocode_destination'
      get 'search/airline',                   to: 'search#airline'
      get 'search/flight_history',            to: 'search#flight_history'
      get 'search/location_by_iata',          to: 'search#location_by_iata'
      get 'search/airport_iata/:iataCode',    to: 'search#airport_iata'
      get 'search/flight_offers',             to: 'search#flight_offers'
      post 'search/flight_offers',             to: 'search#flight_offers'
      get 'search/tours_activities',           to: 'search#tours_activities'

      # Booking-related routes
      post 'booking/poi_offers',              to: 'booking#poi_offers'
      post 'booking/pricing',                 to: 'booking#pricing'
      post 'booking/book_flight',             to: 'booking#book_flight'

      # Payment-related routes
      post 'payments/create_payment_intent',  to: 'payments#create_payment_intent'
      post 'webhooks/stripe',                 to: 'webhooks#stripe'
      get 'payments/retrieve_charge', to: 'payments#retrieve_charge'
    end
  end
end
