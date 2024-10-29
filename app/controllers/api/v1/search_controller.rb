# search_controller.rb
require_relative '../../../models/opencage_api'
require_relative '../../../models/amadeus_api'
require_relative '../../../models/amadeus_faraday_api'

class Api::V1::SearchController < ApplicationController
  wrap_parameters false;



  def airport_city
    begin
      location = params[:location]
      countryCode = params[:countryCode]
      @response = AmadeusApi.new.airport_city_search(location, countryCode)
      render json: @response
    rescue Amadeus::ResponseError  => e
      render json: { error: e.message }
    end
  end

  def airport_iata
    begin
      iata_code = params[:iataCode]
      @response = FlightradarApi.new.airport_iata_search(iata_code)
      render json: @response
    rescue StandardError => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  def location_by_iata
    begin
      iataCode = params[:iataCode]
      @response = AmadeusApi.new.location_by_iata_search(iataCode)
      render json: @response
    rescue Amadeus::ResponseError => e
      render json: { error: e.message }
    end
  end

  def airline
    begin
      airlineCodes = params[:airlineCodes]
      @response = AmadeusApi.new.airline_search(airlineCodes)
      render json: @response
    rescue Amadeus::ResponseError => e
      render json: { error: e.message }
    end
  end

  def flight_offers
    # Rails.logger.info("Received params: #{params.inspect}")
    begin
      permitted_params = params.permit(:origin, :destination, :departureDate, :returnDate, :adults, :currencyCode, :nonStop)
      # permitted_params = params.require(:search).permit(:origin, :destination, :departureDate, :adults)

      origin = permitted_params[:origin]
      destination = permitted_params[:destination]
      departureDate = permitted_params[:departureDate]
      returnDate = permitted_params[:returnDate]
      adults = permitted_params[:adults]
      currencyCode = permitted_params[:currencyCode]
      nonStop = false

      @response = AmadeusApi.new.flight_offers_search(origin, destination, departureDate, returnDate, adults, currencyCode, nonStop)

      # Log the response to the terminal puts
      # puts "((((Response)))) #{@response.inspect}"

      render json: @response

    rescue Amadeus::ResponseError => e
      render json: e.response, status: :unprocessable_entity
    end
  end

  def flight_history
    begin
      permitted_params = params.permit(:originIataCode, :destinationIataCode, :departureDate, :currencyCode)
      @response = AmadeusApi.new.flight_history_search(
        permitted_params[:originIataCode],
        permitted_params[:destinationIataCode],
        permitted_params[:departureDate],
        permitted_params[:currencyCode]
      )
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

  def geocode_destination
    begin
      destination = params[:destination]
      @response = OpencageApi.new.geocode_destination_search(destination)
      render json: @response
    rescue StandardError => e
      render json: { error: e.message }
    end
  end

end
