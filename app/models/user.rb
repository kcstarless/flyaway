class User < ApplicationRecord
  after_create :send_welcome_email

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :api

  has_many :flight_bookings

  private

  def send_welcome_email
    Rails.logger.debug "User created: #{self.inspect}"
    UserMailer.welcome_email(self).deliver_later
  end
end
