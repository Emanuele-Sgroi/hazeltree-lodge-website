import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req, { params }) {
  try {
    const { sessionId } = params;

    // Get paymentIntentId from query params
    const { searchParams } = new URL(req.url);
    const paymentIntentId = searchParams.get("paymentIntentId");

    if (!paymentIntentId) {
      return NextResponse.json({ status: "not_found" });
    }

    // Check Stripe for payment status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      return NextResponse.json({ status: "paid" });
    }

    if (paymentIntent.status === "canceled") {
      return NextResponse.json({ status: "expired" });
    }

    // Any other status is considered pending
    return NextResponse.json({ status: "pending" });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json({ status: "not_found" }, { status: 404 });
  }
}
