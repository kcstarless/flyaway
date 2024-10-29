# Stripe payment controller

class Api::V1::PaymentsController < ApplicationController

  def create_payment_intent
    amount = payment_params[:amount]
    currency = payment_params[:currency]

    payment_intent = Stripe::PaymentIntent.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: { enabled: true },
    })

    render json: { client_secret: payment_intent.client_secret }

  rescue Stripe::StripeError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def payment_params
    params.require(:payment).permit(:amount, :currency)
  end

end
