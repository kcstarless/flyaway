#opencage_api.rb
require 'opencage/geocoder'

class OpencageApi
  attr_accessor :geocoder

  def initialize()
    key = Rails.application.credentials.opencage[:key]
    @geocoder = OpenCage::Geocoder.new(api_key: key)
  end

  def geocode_search(lat, lon)
    @geocoder.reverse_geocode(lat, lon)
  end

  def geocode_destination_search(destinationLocationName)
    @geocoder.geocode(destinationLocationName)
  end
end
