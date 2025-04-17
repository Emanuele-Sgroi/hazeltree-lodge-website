import Stripe from "stripe";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { buildBookingUpdates } from "@/lib/buildBookingUpdates";
import { updateBeds24ServerSide } from "@/lib/beds24";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const {
      paymentIntentId,
      paymentMethodId,
      bookingData,
      sessionId,
      guestValues,
    } = await req.json(); // send guestValues from CheckoutForm

    /* 1. Retrieve the intent – maybe it's already succeeded */
    let paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    /* 2. Confirm if still in requires_confirmation */
    if (paymentIntent.status !== "succeeded") {
      paymentIntent = await stripe.paymentIntents.confirm(
        paymentIntentId,
        { payment_method: paymentMethodId },
        { idempotencyKey: `confirm_${paymentIntentId}` }
      );
    }

    /* 3. Success path */
    if (paymentIntent.status === "succeeded") {
      /* 3a. mark Redis = paid */
      if (sessionId) {
        const key = `pending:${sessionId}`;
        const raw = await redis.get(key);
        if (raw) {
          const rec = typeof raw === "string" ? JSON.parse(raw) : raw;
          rec.status = "paid";
          await redis.set(key, JSON.stringify(rec), { ex: 60 * 20 });
        }
      }

      /* 3b. Build booking updates and send to Beds24 */
      try {
        const bookingUpdates = buildBookingUpdates({
          bookingData,
          totalPrice: paymentIntent.amount / 100,
          guestValues,
          piId: paymentIntent.id,
        });
        await updateBeds24ServerSide(bookingUpdates);
      } catch (bedsErr) {
        console.error("Beds24 update failed:", bedsErr);
        // you might alert yourself here but don't fail the payment
      }

      return NextResponse.json({ success: true, paymentIntentId });
    }

    /* 4. Failure path */
    return NextResponse.json(
      { success: false, error: "Payment could not be completed." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong during the payment. Please try again.",
        devError: error.message,
      },
      { status: 500 }
    );
  }
}

// import Stripe from "stripe";
// import { NextResponse } from "next/server";
// import { redis } from "@/lib/redis";

// const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY);

// export async function POST(req) {
//   try {
//     const { paymentIntentId, paymentMethodId, bookingData, sessionId } =
//       await req.json();

//     /* 1. Get the PaymentIntent – maybe it already succeeded */
//     let paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     /* 2. Still needs confirmation? do it */
//     if (paymentIntent.status !== "succeeded") {
//       paymentIntent = await stripe.paymentIntents.confirm(
//         paymentIntentId,
//         { payment_method: paymentMethodId },
//         { idempotencyKey: `confirm_${paymentIntentId}` }
//       );
//     }

//     /* 3. If it ended in success → mark Redis “paid” */
//     if (paymentIntent.status === "succeeded") {
//       if (sessionId) {
//         const key = `pending:${sessionId}`;
//         const raw = await redis.get(key); // may be string or object
//         if (raw) {
//           const rec = typeof raw === "string" ? JSON.parse(raw) : raw;
//           rec.status = "paid";
//           await redis.set(key, JSON.stringify(rec), { ex: 60 * 20 });
//         }
//       }
//       return NextResponse.json({ success: true, paymentIntentId });
//     }

//     /* 4. Anything else is treated as failure */
//     return NextResponse.json(
//       { success: false, error: "Payment could not be completed." },
//       { status: 400 }
//     );
//   } catch (error) {
//     console.error("Error confirming payment:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Something went wrong during the payment. Please try again.",
//         devError: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
