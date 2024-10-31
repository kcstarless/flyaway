# stripe.rb is a file that initializes the Stripe API key. It is located in the config/initializers directory. The Stripe API key is set using the Stripe gem, and the value is retrieved from an environment variable (STRIPE_SECRET_KEY) that is set in the application's configuration.

require 'stripe'

# Set the Stripe API key from Rails credentials
Stripe.api_key = Rails.application.credentials.stripe[:sk_key] if Rails.application.credentials.stripe[:sk_key]

unless Stripe.api_key
  Rails.logger.warn("STRIPE_SECRET_KEY is not set; Stripe will not be initialized.")
  # You might choose to raise an error or set a default value if needed
end
