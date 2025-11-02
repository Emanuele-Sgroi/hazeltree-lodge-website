import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const {
      paymentIntentId,
      paymentMethodId,
      bookingData,
      sessionId,
      guestValues,
    } = await req.json();

    if (!paymentIntentId || !paymentMethodId) {
      return NextResponse.json(
        { success: false, error: "Missing payment details" },
        { status: 400 }
      );
    }

    // Retrieve the PaymentIntent
    let paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // If already succeeded, skip confirmation
    if (paymentIntent.status === "succeeded") {
      // Payment already completed, update Beds24
      return NextResponse.json({
        success: true,
        paymentIntentId: paymentIntent.id,
      });
    }

    // Confirm the payment with unique idempotency key
    const idempotencyKey = `confirm_${paymentIntentId}_${Date.now()}`;

    paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method: paymentMethodId,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/checkout/${sessionId}`,
      },
      { idempotencyKey }
    );

    // Handle different payment statuses
    if (paymentIntent.status === "succeeded") {
      // Payment succeeded immediately (no 3DS required)
      return NextResponse.json({
        success: true,
        paymentIntentId: paymentIntent.id,
      });
    }

    if (paymentIntent.status === "requires_action") {
      // 3D Secure authentication required - client must handle this
      return NextResponse.json({
        success: false,
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    // Any other status is a failure
    return NextResponse.json(
      {
        success: false,
        error: `Payment status: ${paymentIntent.status}`,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Payment confirmation failed",
      },
      { status: 500 }
    );
  }
}
