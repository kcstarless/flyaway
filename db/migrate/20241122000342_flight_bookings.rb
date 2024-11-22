class FlightBookings < ActiveRecord::Migration[7.1]
  def change
    create_table :flight_bookings do |t|
      t.string :created_booking_id, null: false
      t.integer :user_id, null: true  # Add user_id column that can be null
      t.string :booking_reference
      t.decimal :total_price, precision: 10, scale: 2
      t.string :payment_status, default: 'pending'
      t.json :itinerary
      t.json :travelers

      t.timestamps
    end
  end
end
