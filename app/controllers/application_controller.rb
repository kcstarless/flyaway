class ApplicationController < ActionController::API
    # Automatically authenticate the user for each API request
    # before_action :authenticate_devise_api_token!

    # Use current_devise_api_user to access the current user
    def current_user
      current_devise_api_user
    end
end
