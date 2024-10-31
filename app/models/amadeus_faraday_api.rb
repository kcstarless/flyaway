require 'faraday'
require 'json'

class AmadeusFaradayApi
  attr_accessor :conn

  def initialize
    @conn = Faraday.new(url: 'https://test.api.amadeus.com') do |faraday|
      faraday.adapter Faraday.default_adapter
    end
  end

  # Fetch the access token
  def fetch_access_token
    response = @conn.post('/v1/security/oauth2/token') do |req|
      req.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      req.body = {
        grant_type: 'client_credentials',
        client_id: ENV['AMADEUS_API_KEY'],
        client_secret: ENV['AMADEUS_API_SECRET']
      }.to_query
    end

    if response.success?
      JSON.parse(response.body)['access_token']
    else
      puts "Error fetching access token: #{response.body}"
      nil
    end
  end

  # Flight-offers API call to search for flight offers
  # def flight_offers_search(origin, destination, departureDate, returnDate, adults, currencyCode, nonStop)
  #   access_token = fetch_access_token
  #   return nil unless access_token # Return nil if access token retrieval failed

  #   response = @conn.get('/v2/shopping/flight-offers') do |req|
  #     req.headers['Authorization'] = "Bearer #{access_token}"
  #     req.params['originLocationCode'] = origin
  #     req.params['destinationLocationCode'] = destination
  #     req.params['departureDate'] = departureDate
  #     req.params['returnDate'] = returnDate
  #     req.params['adults'] = adults
  #     req.params['currencyCode'] = currencyCode
  #     req.params['nonStop'] = nonStop
  #   end

  #   if response.success?
  #     JSON.parse(response.body)
  #   else
  #     puts "Error: #{response.status} - #{response.body}"
  #     nil
  #   end
  # rescue Faraday::ConnectionFailed => e
  #   puts "Connection error: #{e.message}"
  #   nil
  # rescue JSON::ParserError => e
  #   puts "JSON parsing error: #{e.message}"
  #   nil
  # end

  # Flight-Offers-Price API calls to confirm price and availability of selected offer
  def flight_offer_price(offer)
    access_token = fetch_access_token
    return nil unless access_token # Return nil if access token retrieval failed

    request_body = {
      data: {
        type: "flight-offers-pricing",
        flightOffers: [offer] # Wrap the offer in an array
      }
    }

    # puts "Request payload: #{request_body.to_json}" # Log the request payload

    response = @conn.post('/v1/shopping/flight-offers/pricing') do |req|
      req.headers['Authorization'] = "Bearer #{access_token}"
      req.headers['Content-Type'] = 'application/json'
      req.body = request_body.to_json # Convert request body hash to JSON
    end

    if response.success?
      JSON.parse(response.body)
    else
      puts "Error: #{response.status} - #{response.body}"
      nil
    end
  rescue Faraday::ConnectionFailed => e
    puts "Connection error: #{e.message}"
    nil
  rescue JSON::ParserError => e
    puts "JSON parsing error: #{e.message}"
    nil
  end


  # flight_create_order API calls to create booking confirmation.
  def flight_create_order(offer, travelers)
    access_token = fetch_access_token
    retun nil unless access_token

    travelers = JSON.parse(travelers) if travelers.is_a?(String)

    request_body = {
      data: {
        type: "flight-order",
        flightOffers: [offer],
        travelers: travelers
      }
    }

    response = @conn.post('/v1/booking/flight-orders') do |req|
      req.headers['Authorization'] = "Bearer #{access_token}"
      req.headers['Content-type'] = 'application/json'
      req.body = request_body.to_json
    end

    if response.success?
      JSON.parse(response.body)
    else
      puts "Error: #{response.status} - #{response.body}"
      nil
    end
  rescue Faraday::ConnectionFailed => e
    puts "Connection error: #{e.message}"
    nil
  rescue JSON::ParserError => e
    puts "JSON parsing error: #{e.message}"
    nil
  end
end
