require_relative '../../../models/opencage_api'

class Api::V1::SearchController < ApplicationController
  wrap_parameters false;

  def airport_city
    begin
      location = params[:location]
      @response = AmadeusApi.new.airport_search(location)
      render json: @response
    rescue Amadeus::ResponseError  => e
      render json: { error: e.message }
    end
  end

  def flight_offers
    # Rails.logger.info("Received params: #{params.inspect}")
    begin
      permitted_params = params.permit(:origin, :destination, :departureDate, :adults, :currencyCode)
      # permitted_params = params.require(:search).permit(:origin, :destination, :departureDate, :adults)

      origin = permitted_params[:origin]
      destination = permitted_params[:destination]
      departureDate = permitted_params[:departureDate]
      adults = permitted_params[:adults]
      currencyCode = permitted_params[:currencyCode]


      @response = AmadeusApi.new.flight_offers_search(origin, destination, departureDate, adults, currencyCode)
      render json: @response
    rescue Amadeus::ResponseError => e
      render json: { error: e.message }
    end
  end

  def geocode
    begin
      latitude = params[:latitude]
      longitude = params[:longitude]
      @response = OpencageApi.new.geocode_search(latitude, longitude)
      render json: @response
    rescue StandardError => e
      render json: { error: e.message }
    end
  end

end
