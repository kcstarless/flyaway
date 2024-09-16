Rails.application.routes.draw do
  # APIroutes should be in /api/v1
  namespace :api do
    namespace :v1 do
      resources :users
      get 'search/airport_city', to: 'search#airport_city'
      get 'search/flight_offers', to: 'search#flight_offers'
    end
  end
end
