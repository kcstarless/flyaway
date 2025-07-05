# booking_controller.rb

require_relative '../../../models/amadeus_faraday_api'
require_relative '../../../services/flight_booking_service'

class Api::V1::BookingController < ApplicationController
  wrap_parameters false;

  def book_flight
    begin
      offer = params[:offer]
      travelers = params[:travelers]
      @response = AmadeusFaradayApi.new.flight_create_order(offer, travelers)

      # if current_user.nil?
      #   render json: { error: 'User not authenticated' }, status: :unauthorized
      #   return
      # end

    # If current_user is nil, create flight booking without user association
    if current_user.nil?
      # Optionally, handle guest booking, maybe with a guest user model
      flight_booking_service = FlightBookingService.new(@response, nil)  # No user is provided
      booking_data = flight_booking_service.prepare_flight_booking_data
      @flight_booking = FlightBooking.create!(booking_data[:booking])
      Rails.logger.info("Flight booking created without user association.")
    else
      # Handle logged-in user flight booking
      flight_booking_service = FlightBookingService.new(@response, current_user)
      booking_data = flight_booking_service.prepare_flight_booking_data
      @flight_booking = FlightBooking.create!(booking_data[:booking])
      Rails.logger.info("Flight booking created for user: #{current_user.id}")
    end

      render json: @response
      # Rails.logger.info("Flight booking response: #{@response}")
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

  def update_flight_booking_payment_status
    created_booking_id= params[:created_booking_id]

    booking = FlightBooking.find_by(created_booking_id: created_booking_id)

    if booking
      booking.update(payment_status: 'paid')
      BookingMailer.booking_confirmation_email(booking).deliver_later
      render json: { message: 'Payment status updated successfully.' }, status: :ok
    else
      render json: { error: 'Flight booking not found.' }, status: :not_found
    end
  end

  def upcoming_flight
    if current_user.nil?
      render json: { message: 'User not authenticated' }, status: :unauthorized
      return
    end
    # Rails.logger.info "Current User: #{current_user.id}"
    id  = current_user.id
    current_date = Date.today

    booking = FlightBooking.where(user_id: id)
                            .where(payment_status: 'paid')
                            .where("itinerary->'segments'->0->'departure'->>'at' >= ?", current_date.to_s)

    if booking
      Rails.logger.info "Upcoming Flight: #{booking}"
      render json: booking
    else
      render json: { message: 'No upcoming flights found for this user.'}, status: :not_found
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
