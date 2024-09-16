class Api::V1::SearchController < ApplicationController
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
    begin
      origin = params[:origin]
      destination = params[:destination]
      departureDate = params[:departureDate]
      adults = params[:adults]
      @response = AmadeusApi.new.flight_offers_search(origin, destination, departureDate, adults)
      render json: @response
    rescue Amadeus::ResponseError  => e
      render json: { error: e.message }
    end
  end
end
