/**
 * Minimal wrapper that posts your bookingUpdates array to the
 * existing /api/update-booking route so we reuse your current code.
 */
export async function updateBeds24ServerSide(bookingUpdates) {
  const base = process.env.SITE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/update-booking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookingUpdates),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Beds24 update failed: ${text}`);
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(`Beds24 returned errors: ${JSON.stringify(data.errors)}`);
  }
}
