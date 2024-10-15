Rails.application.routes.draw do
  # APIroutes should be in /api/v1
  namespace :api do
    namespace :v1 do
      resources :users
      get 'search/airport_city', to: 'search#airport_city'
      post 'search/flight_offers', to: 'search#flight_offers'
      get 'search/geocode', to: 'search#geocode'
      get 'search/flight_offers', to: 'search#flight_offers'
      get 'search/airline', to: 'search#airline'
      get 'search/geocode_destination', to: 'search#geocode_destination'
      post 'search/poi_offers', to: 'search#poi_offers'
      get 'search/poi_offers', to: 'search#poi_offers'
      get 'search/flight_history', to: 'search#flight_history'
      get 'search/location_by_iata', to: 'search#location_by_iata'
      get 'search/airport_iata/:iataCode', to: 'search#airport_iata'
    end
  end
end
