class BookingMailer < ApplicationMailer
  default from: ENV['GMAIL_USERNAME']

  def booking_confirmation_email(booking)
    @booking = booking
    @email = @booking.travelers.first['contact']['emailAddress']
    mail(to: @email, subject: "Booking Confirmation")
  end
end
