class FlightBooking < ApplicationRecord
  belongs_to :user, optional: true # Allow user_id to be nil

  validates :created_booking_id,
            :booking_reference,
            :total_price,
            :payment_status,
            :itinerary,
            :travelers,
            presence: true
end
