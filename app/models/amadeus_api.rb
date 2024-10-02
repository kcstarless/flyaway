# Amadeus_api.rb
require 'amadeus'

class AmadeusApi
  attr_accessor :amadeus

  def initialize()
    @amadeus = Amadeus::Client.new(
      client_id: ENV['AMADEUS_API_KEY'],
      client_secret: ENV['AMADEUS_API_SECRET']
    )
  end

  def airport_search(keyword)
    @amadeus.reference_data.locations.get(
      keyword: keyword,
      subType: Amadeus::Location::ANY
    )
  end

  def airline_search(code)
    @amadeus.reference_data.airlines.get(airlineCodes: code)
  end

  def flight_offers_search(origin, destination, departureDate, adults, currencyCode, nonStop)
    @amadeus.shopping.flight_offers_search.get(
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: adults,
      currencyCode: currencyCode,
      nonStop: nonStop
    )
  end
end
