/**
 * @file stripe.js
 * @description Utility for handling Stripe payments. This module initializes Stripe and provides a function to create a payment intent.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import Stripe from "stripe";

// Initialize Stripe with the secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Function to create a payment intent
async function createPaymentIntent(amount) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "eur",
      // Additional configurations can go here
    });

    return paymentIntent;
  } catch (error) {
    console.error("Failed to create payment intent:", error);
    throw new Error("Failed to create payment intent");
  }
}

// Export the functions you might need in your application
export default {
  createPaymentIntent,
};
