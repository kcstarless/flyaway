class FlightBookingService
  def initialize(response, user)
    @response = response
    @user = user
  end

  def prepare_flight_booking_data
    {
      booking: prepare_booking_data,
    }
  end

  private

  def prepare_booking_data
    segment_length = @response.dig('data', 'flightOffers', 0, 'itineraries', 0, 'segments').length - 1

    depart_date_time = @response.dig('data', 'flightOffers', 0, 'itineraries', 0, 'segments', 0, 'departure', 'at')

    destination_iata = @response.dig('data', 'flightOffers', 0, 'itineraries', 0, 'segments', segment_length, 'arrival', 'iataCode')
    departure_iata = @response.dig('data', 'flightOffers', 0, 'itineraries', 0, 'segments', 0, 'departure', 'iataCode')

    Rails.logger.info("response: #{@response}")

    destination_name = FlightradarApi.new.airport_iata_search(destination_iata).dig('details', 'position', 'region', 'city')
    departure_name = FlightradarApi.new.airport_iata_search(departure_iata).dig('details', 'position', 'region', 'city')

    Rails.logger.info("Destination_iata:#{destination_iata}")
    Rails.logger.info("City Name:  #{destination_name}")
    # travelers_data = @response.dig('data', 'travelers')
    # itinerary_data = @response.dig('data', 'flightOffers', 0, 'itineraries', 0)
    # Rails.logger.info "Itinerary Data: #{itinerary_data.inspect}"
    # Rails.logger.info "Travelers Data: #{travelers_data.inspect}"
    # Rails.logger.info "Payment Amount: #{@response['data']['flightOffers'][0]['price']['total']}"
    {
      created_booking_id: @response.dig('data', 'id'),
      booking_reference: @response.dig('data', 'associatedRecords', 0, 'reference'),
      total_price: @response.dig('data', 'flightOffers', 0, 'price', 'total'),
      payment_status: 'pending',
      itinerary: @response.dig('data', 'flightOffers', 0, 'itineraries', 0),
      travelers: @response.dig('data', 'travelers'),
      user_id: @user&.id,
      destination: destination_name,
      departing: departure_name,
      time_of_departure: depart_date_time
    }
  end
end
