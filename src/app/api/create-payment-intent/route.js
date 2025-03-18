/**
 * @file route.js
 * @description API route for creating a PaymentIntent using Stripe. This route handles a POST request with the payment amount and returns the client secret, which is used to complete the payment on the frontend.
 * @note There is a different between the "Test Secret Key" and the actual Secret Key. Refer to Stripe documentation
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

export const dynamic = "force-dynamic";

import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";

// Initialize Stripe with the secret key from the environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Use test in dev mode

/**
 * API Route Handler for creating a PaymentIntent.
 *
 * This function expects a POST request with a JSON body containing the payment amount.
 * It validates the amount, creates a PaymentIntent using Stripe, and returns the client secret.
 *
 * @param {Request} request - The incoming request object containing the payment details.
 * @returns {Response} JSON response with the client secret or error message.
 */
export async function POST(request) {
  try {
    const { amount, sessionId } = await request.json(); // Extract the amount from the request body

    // Validate the amount
    if (!amount || typeof amount !== "number") {
      return new Response(
        JSON.stringify({ error: "Invalid amount provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use the sessionId if present, otherwise generate a random key
    const idempotencyKey = sessionId || uuidv4();

    // Create a PaymentIntent with the specified amount and currency (EUR in this case)
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency: "eur",
        payment_method_types: ["card"],
      },
      { idempotencyKey }
    );

    // Respond with the client secret needed for completing the payment
    return new Response(
      JSON.stringify({
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating payment intent:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create payment intent",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
