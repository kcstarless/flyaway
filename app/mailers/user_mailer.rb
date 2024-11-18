class UserMailer < ApplicationMailer
  default from: ENV['GMAIL_USERNAME']

  # Send a welcome email to the user after sign up
  def welcome_email(user)
    @user = user
    @url = 'https://flyaway-rails-react.fly.dev/'
    mail(to: @user.email, subject: "Welcome to FlyAway!")
  end
end
