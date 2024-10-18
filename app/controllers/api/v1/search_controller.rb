# search_controller.rb


require_relative '../../../models/opencage_api'
require_relative '../../../models/amadeus_api'
require_relative '../../../models/amadeus_faraday_api'

class Api::V1::SearchController < ApplicationController
  wrap_parameters false;

    # POST /api/v1/search/confirm_price
    def pricing
      begin
      offer = price_params[:offer] # Get the flight offer from the request parameters
      # include_options = price_params[:include] || [] # Get optional include parameters
        offer =  offer = {
        "type": "flight-offer",
        "id": "1",
        "source": "GDS",
        "instantTicketingRequired": false,
        "nonHomogeneous": false,
        "oneWay": false,
        "isUpsellOffer": false,
        "lastTicketingDate": "2024-11-01",
        "numberOfBookableSeats": 9,
        "itineraries": [
          {
            "duration": "PT18H25M",
            "segments": [
              {
                "departure": {
                  "iataCode": "CDG",
                  "at": "2024-11-01T10:00:00"
                },
                "arrival": {
                  "iataCode": "FRA",
                  "at": "2024-11-01T14:30:00"
                },
                "carrierCode": "6X",
                "number": "501",
                "aircraft": {
                  "code": "744"
                },
                "operating": {
                  "carrierCode": "6X"
                },
                "duration": "PT4H30M",
                "id": "1",
                "numberOfStops": 0
              },
              {
                "departure": {
                  "iataCode": "FRA",
                  "at": "2024-11-01T18:10:00"
                },
                "arrival": {
                  "iataCode": "ICN",
                  "at": "2024-11-02T11:25:00"
                },
                "carrierCode": "6X",
                "number": "9744",
                "aircraft": {
                  "code": "744"
                },
                "operating": {
                  "carrierCode": "6X"
                },
                "duration": "PT10H15M",
                "id": "2",
                "numberOfStops": 0
              }
            ]
          }
        ],
        "price": {
          "currency": "EUR",
          "total": "272.36",
          "base": "136.00",
          "grandTotal": "272.36"
        },
        "pricingOptions": {
          "fareType": ["PUBLISHED"],
          "includedCheckedBagsOnly": true
        },
        "validatingAirlineCodes": ["6X"],
        "travelerPricings": [
          {
            "travelerId": "1",
            "fareOption": "STANDARD",
            "travelerType": "ADULT",
            "price": {
              "currency": "EUR",
              "total": "136.18",
              "base": "68.00"
            },
            "fareDetailsBySegment": [
              {
                "segmentId": "1",
                "cabin": "ECONOMY",
                "fareBasis": "YCNV1",
                "class": "Y",
                "includedCheckedBags": {
                  "quantity": 1
                }
              },
              {
                "segmentId": "2",
                "cabin": "ECONOMY",
                "fareBasis": "YCNV1",
                "class": "Y",
                "includedCheckedBags": {
                  "quantity": 1
                }
              }
            ]
          }
        ]
      }
      # Call the flight_offer_price method with the provided offer and include options
      @response = AmadeusFaradayApi.new.flight_offer_price(offer)

      Rails.logger.info("Received response from Amadeus API: #{@response}")

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
      render json: @reponse
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

  def poi_offers
    begin
      permitted_params = params.permit(:latitude, :longitude, :radius)

      latitude = permitted_params[:latitude]
      longitude = permitted_params[:longitude]
      radius = permitted_params[:radius]

      @reponse = AmadeusApi.new.poi_search(latitude, longitude, radius)
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


  private

  def price_params
    params.permit(:offer, include: [])
  end

end
