# booking_controller.rb

require_relative '../../../models/amadeus_faraday_api'

class Api::V1::BookingController < ApplicationController
  wrap_parameters false;

  def book_flight
    begin
      offer = params[:offer]
      travelers = params[:travelers]
      @response = AmadeusFaradayApi.new.flight_create_order(offer, travelers)

      render json: @response
    rescue Amadeus::ResponseError => e
      Rails.logger.error("Response error: #{e.message}")
      render json: { error: e.message }, status: :unprocessable_entity
    rescue Amadeus::NetworkError => e
      Rails.logger.error("Network error occurred: #{e.message}")
      render json: { error: 'Network error occurred. Please try again later.' }, status: :service_unavailable
    rescue StandardError => e
      Rails.logger.error("Unexpected error: #{e.message}")
      render json: { error: 'An unexpected error occurred.', details: e.message }, status: :internal_server_error
    end
  end

  def poi_offers
    begin
      permitted_params = params.permit(:latitude, :longitude, :radius)

      latitude = permitted_params[:latitude]
      longitude = permitted_params[:longitude]
      radius = permitted_params[:radius]

      @response = AmadeusApi.new.poi_search(latitude, longitude, radius)
      render json: @response
    rescue Amadeus::ResponseError => e
      render json: { error: e.message }
    end
  end

  # POST /api/v1/search/confirm_price
  def pricing
    begin
      offer = params[:offer]
      @response = AmadeusFaradayApi.new.flight_offer_price(offer)

      render json: @response
    rescue Amadeus::ResponseError => e
      Rails.logger.error("Response error: #{e.message}")
      render json: { error: e.message }, status: :unprocessable_entity
    rescue Amadeus::NetworkError => e
      Rails.logger.error("Network error occurred: #{e.message}")
      render json: { error: 'Network error occurred. Please try again later.' }, status: :service_unavailable
    rescue StandardError => e
      Rails.logger.error("Unexpected error: #{e.message}")
      render json: { error: 'An unexpected error occurred.', details: e.message }, status: :internal_server_error
    end
  end


end
