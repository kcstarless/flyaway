require 'flight_radar'

class FlightradarApi
  attr_accessor :flight_radar

  def airport(keyword)
    @flight_radar = FlightRadar.airport(keyword)
  end

  def flights()
    @flight_radar = FlightRadar.flights
  end
end
