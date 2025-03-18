import Stripe from "stripe";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY);

export async function POST(req) {
  try {
    const { paymentIntentId, paymentMethodId, bookingData } = await req.json();

    // For safety, also fetch your PaymentIntent from Stripe to check its status
    let paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // If it's already succeeded or something, we can skip re-confirmation
    if (paymentIntent.status === "succeeded") {
      return NextResponse.json({ success: true, alreadyPaid: true });
    }

    // Confirm the PaymentIntent
    // Use an idempotency key
    const idempotencyKey = `confirm_${paymentIntentId}`;

    paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method: paymentMethodId,
      },
      {
        idempotencyKey,
      }
    );

    if (paymentIntent.status === "succeeded") {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `Unexpected status: ${paymentIntent.status}`,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
