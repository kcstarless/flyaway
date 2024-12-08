# app/controllers/api/v1/webhooks_controller.rb
require_relative '../../../services/flight_booking_service'

class Api::V1::WebhooksController < ApplicationController
  def stripe
    Rails.logger.info "Webhook received!!!!"
    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    event = nil

    begin
      event = Stripe::Webhook.construct_event(
        payload, sig_header, Rails.application.credentials.dig(:stripe, :wh_key)
      )
      # Rails.logger.info "Event: #{event}"
    rescue JSON::ParserError => e
      Rails.logger.error "Invalid payload: #{e.message}"
      render json: { error: 'Invalid payload' }, status: 400
      return
    rescue Stripe::SignatureVerificationError => e
      Rails.logger.error "Invalid signature: #{e.message}"
      render json: { error: 'Invalid signature' }, status: 400
      return
    end

    case event['type']
      when 'payment_intent.created'
        payment_intent = event['data']['object']
        Rails.logger.info "PaymentIntent was created!!!"
      when 'charge.updated'
        charge = event['data']['object'] # Handle the charge.updated event here
        Rails.logger.info "Charge succeeded!!!!"

        # Correct usage
        ActionCable.server.broadcast('notifications_channel', { event: 'charge.succeeded', charge: charge })
      when 'payment_intent.succeeded'
        payment_intent = event['data']['object']
        Rails.logger.info "PaymentIntent was successful!!!"
    else
      Rails.logger.info "Unhandled event type: #{event['type']}"
    end
    render json: { message: 'success' }
  end
end
