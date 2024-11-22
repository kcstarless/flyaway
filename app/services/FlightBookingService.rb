class FlightBookingService
  def initialize(response)
    @response = response
  end

  def prepare_data_for_db
    {
      booking: preprare_booking_data,
    }
  end

  private

  def prepare_booking_data
    {
      created_booking_id: @response.dig('data', 'id'),
      created_at: @response.dig('data', 'associatedRecords', 0, 'creationDate'),
      booking_reference: @response.dig('data', 'associatedRecords', 0, 'reference'),
      total_price: @response.dig('data', 'flightOffers', 0, 'price', 'total'),
      payment_status: 'pending',
      itinerary: @response.dig('data', 'flightOffers', 0, 'itineraries', 0),
      travelers: @response.dig('data', 'flightOffers', 0, 'travelers')
    }
  end
end
