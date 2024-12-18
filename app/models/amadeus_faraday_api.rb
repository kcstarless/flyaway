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

  # flight-offers API call to search for flight offers /NOTUSED
  def flight_offers_search(origin, destination, departureDate, returnDate, adults, currencyCode, nonStop)
    access_token = fetch_access_token
    return nil unless access_token

    travelers = (1..adults.to_i).map do |i|
      { id: i.to_s, travelerType: "ADULT", fareOptions: ["STANDARD"] }
    end
    formatted_departure_date = Date.parse(departureDate).strftime('%Y-%m-%d')
    request_body = {
      currencyCode: currencyCode,
      originDestinations: [
        {
          id: "1",
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDateTimeRange: {
            date: formatted_departure_date,
            time: "10:00:00"
          }
        }
      ],
      travelers: travelers,
      sources: ["GDS"],
      searchCriteria: {
        maxFlightOffers: 2,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: "BUSINESS",
              coverage: "MOST_SEGMENTS",
              originDestinationIds: ["1"]
            }
          ],
          carrierRestrictions: {
            excludedCarrierCodes: ["AA", "TP", "AZ"]
          }
        }
      }
    }

    response = @conn.post('/v2/shopping/flight-offers', request_body.to_json) do |req|
      req.headers['Authorization'] = "Bearer #{access_token}"
      req.headers['Content-Type'] = 'application/json'
      req.headers['X-HTTP-Method-Override'] = 'GET'
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
