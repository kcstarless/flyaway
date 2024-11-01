# stripe.rb is a file that initializes the Stripe API key. It is located in the config/initializers directory. The Stripe API key is set using the Stripe gem, and the value is retrieved from an environment variable (STRIPE_SECRET_KEY) that is set in the application's configuration.

require 'stripe'

Stripe.api_key = if Rails.env.production? && Rails.application.credentials.dig(:stripe, :sk_key).present?
                   Rails.application.credentials.dig(:stripe, :sk_key)
                 else
                   ENV['STRIPE_SECRET_KEY']
                 end

Rails.logger.info "Stripe API Key: #{Stripe.api_key.present?}"
unless Stripe.api_key
  Rails.logger.warn("STRIPE_SECRET_KEY is not set; Stripe will not be initialized.")
end
