class AddDestinationDepartingAndTimeOfDepartureToFlightBookings < ActiveRecord::Migration[7.1]
  def change
    add_column :flight_bookings, :destination, :string
    add_column :flight_bookings, :departing, :string
    add_column :flight_bookings, :time_of_departure, :datetime
  end
end
