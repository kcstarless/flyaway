# Amadeus_api.rb
require 'amadeus'
require 'faraday'
require 'json'

class AmadeusApi
  attr_accessor :amadeus

  def initialize()
    @amadeus = Amadeus::Client.new(
      client_id: ENV['AMADEUS_API_KEY'],
      client_secret: ENV['AMADEUS_API_SECRET']
    )
  end

  # Airport/City/Location API calls for location suggestion list (autocomplete)
  def airport_city_search(keyword, countryCode = nil)
    @amadeus.reference_data.locations.get(
      keyword: keyword,
      subType: Amadeus::Location::ANY,
      countryCode:
    )
  end

  # Location search by Iata Code
  def location_by_iata_search(code)
    @amadeus.reference_data.location(code).get
  end


  # Airline detail API call
  def airline_search(code)
    @amadeus.reference_data.airlines.get(airlineCodes: code)
  end

  # Flight offer API call
  def flight_offers_search(origin, destination, departureDate, returnDate, adults, currencyCode, nonStop)
    @amadeus.shopping.flight_offers_search.get(
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      adults: adults,
      currencyCode: currencyCode,
      nonStop: nonStop
    )
  end

  # flight historical price analysis
  def flight_history_search(originIataCode, destinationIataCode, departureDate, currencyCode)
    @amadeus.analytics.itinerary_price_metrics.get(
      originIataCode: originIataCode,
      destinationIataCode: destinationIataCode,
      departureDate: departureDate,
      currencyCode: currencyCode,
      oneWay: false
    )
  end

  # Points of interest API call
  def poi_search(latitude, longitude, radius)
    # @amadeus.safety.safety_rated_locations.get(
    #   latitude: latitude,
    #   longitude: longitude,
    # )
    @amadeus.get('/v1/shopping/activities',
      latitude: latitude,
      longitude: longitude,
      radius: radius,
    )
  end
end
