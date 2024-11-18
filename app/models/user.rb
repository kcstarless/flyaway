class User < ApplicationRecord
  after_create :send_welcome_email
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :api

  private

  def send_welcome_email
    Rails.logger.debug "User created: #{self.inspect}"
    UserMailer.welcome_email(self).deliver_later
  end
end
