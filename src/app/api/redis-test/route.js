import { redis } from "@/lib/redis";
import { NextResponse } from "next/server"; // helper to send JSON

// Handles GET /api/redis-test
export async function GET() {
  // write a key that auto‑expires in 60 seconds
  await redis.set("hello", "world", { ex: 60 });

  // read it back
  const value = await redis.get("hello");

  // return JSON { value: "world" }
  return NextResponse.json({ value });
}
