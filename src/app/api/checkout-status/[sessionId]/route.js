import { redis } from "@/lib/redis";
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req, { params }) {
  const key = `pending:${params.sessionId}`;
  const raw = await redis.get(key);

  // ✅ Only parse if it's a string
  const rec = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (!rec) return NextResponse.json({ status: "not_found" });

  if (rec.status === "paid") return NextResponse.json({ status: "paid" });
  if (rec.status === "expired") return NextResponse.json({ status: "expired" });

  if (Date.now() > rec.expiresAt) {
    rec.status = "expired";
    await redis.set(key, JSON.stringify(rec), { ex: 60 * 20 });
    return NextResponse.json({ status: "expired" });
  }

  /* still pending → double-check with Stripe */
  const pi = await stripe.paymentIntents.retrieve(rec.paymentIntentId);
  if (pi.status === "succeeded") {
    rec.status = "paid";
    await redis.set(key, JSON.stringify(rec), { ex: 60 * 20 });
    return NextResponse.json({ status: "paid" });
  }

  return NextResponse.json({ status: "pending" });
}
