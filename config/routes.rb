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
    end
  end
end
