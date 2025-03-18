/**
 * @file route.js
 * @description API route for deleting temporary bookings in Beds24. This route handles both DELETE requests (for query parameters) and POST requests (for request body data) to delete one or more temporary bookings. The temporary bookings are used to reserve spots for rooms during the checkout process.
 * @note The POST method is useful for scenarios like browser/tab closures using navigator.sendBeacon.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/tokenManager";

async function cancelBookingsInBeds24(bookingIds, token) {
  // This updates each booking ID to status: "cancelled".
  // We'll reuse your existing Beds24 "update" logic.
  // For example, you can do a POST to update-booking route with these updates:

  const updates = bookingIds.map((id) => ({
    id,
    status: "cancelled",
  }));

  // Call the /api/v2/bookings endpoint with method POST
  // or if you have a local route: /api/update-booking
  const response = await fetch("https://beds24.com/api/v2/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Failed to cancel bookings: ${errorData.message || response.statusText}`
    );
  }

  const data = await response.json();
  // data should be an array with .success or not
  const allSuccess = data.every((res) => res.success === true);
  if (!allSuccess) {
    throw new Error("Some bookings could not be cancelled before deletion.");
  }

  return data;
}

/**
 * Utility function to delete temporary bookings in Beds24.
 *
 * @param {number[]} bookingIds - Array of booking IDs to delete.
 * @param {string} token - Beds24 access token.
 * @returns {Promise<any>} - Beds24 API response.
 */
async function deleteBookingsInBeds24(bookingIds, token) {
  try {
    //Flag booking to "cancelled" first
    await cancelBookingsInBeds24(bookingIds, token);

    // Construct the query parameters
    const queryParams = bookingIds
      .map((id) => `id=${encodeURIComponent(id)}`)
      .join("&");
    const url = `https://beds24.com/api/v2/bookings?${queryParams}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        token: token, // Use the token in the header
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to delete temporary bookings: ${
          errorData.message || response.statusText
        }`
      );
    }

    return await response.json();
  } catch (error) {
    //log the error for debugging
    console.error(`Error deleting bookings: ${error.message}`);
    throw error;
  }
}

/**
 * Handles DELETE requests to delete temporary bookings.
 * Extracts booking IDs from query parameters.
 *
 * @param {Request} req - The incoming request object containing query parameters.
 * @returns {NextResponse} JSON response indicating success or error.
 */
export async function DELETE(req) {
  try {
    const token = await getAccessToken();

    const { searchParams } = new URL(req.url);
    const ids = searchParams.getAll("id"); // Get all 'id' query parameters

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { success: false, errors: [{ message: "No booking IDs provided." }] },
        { status: 400 }
      );
    }

    // Convert booking IDs to numbers
    const bookingIds = ids.map((id) => Number(id));

    // Validate bookingIds
    if (bookingIds.some(isNaN)) {
      return NextResponse.json(
        { success: false, errors: [{ message: "Invalid booking IDs." }] },
        { status: 400 }
      );
    }

    const deletionResponse = await deleteBookingsInBeds24(bookingIds, token);

    // Beds24's response structure
    if (deletionResponse && Array.isArray(deletionResponse)) {
      const success = deletionResponse.every((res) => res.success);
      if (success) {
        return NextResponse.json({ success: true }, { status: 200 });
      } else {
        return NextResponse.json(
          {
            success: false,
            errors: deletionResponse.flatMap((res) => res.errors || []),
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          errors: [{ message: "Unexpected response from Beds24." }],
        },
        { status: 500 }
      );
    }
  } catch (error) {
    //log the error for debugging
    console.error(`Error in delete-temp-booking API: ${error.message}`);
    return NextResponse.json(
      {
        success: false,
        errors: [{ message: "Failed to delete temporary bookings." }],
      },
      { status: 500 }
    );
  }
}

/**
 * Handles POST requests to delete temporary bookings.
 * Extracts booking IDs from the request body.
 *
 * This method is especially useful for scenarios like browser/tab closures
 * where navigator.sendBeacon can be used to trigger the deletion.
 *
 * @param {Request} req - The incoming request object containing booking IDs in the body.
 * @returns {NextResponse} JSON response indicating success or error.
 */
export async function POST(req) {
  try {
    const token = await getAccessToken();

    const { bookingIds } = await req.json();

    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      return NextResponse.json(
        { success: false, errors: [{ message: "No booking IDs provided." }] },
        { status: 400 }
      );
    }

    // Convert booking IDs to numbers
    const validBookingIds = bookingIds.map((id) => Number(id));

    // Validate bookingIds
    if (validBookingIds.some((id) => isNaN(id))) {
      return NextResponse.json(
        { success: false, errors: [{ message: "Invalid booking IDs." }] },
        { status: 400 }
      );
    }

    const deletionResponse = await deleteBookingsInBeds24(
      validBookingIds,
      token
    );

    // Beds24's response structure
    if (deletionResponse && Array.isArray(deletionResponse)) {
      const success = deletionResponse.every((res) => res.success);
      if (success) {
        return NextResponse.json({ success: true }, { status: 200 });
      } else {
        return NextResponse.json(
          {
            success: false,
            errors: deletionResponse.flatMap((res) => res.errors || []),
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          errors: [{ message: "Unexpected response from Beds24." }],
        },
        { status: 500 }
      );
    }
  } catch (error) {
    //log the error for debugging
    console.error(`Error in delete-temp-booking API: ${error.message}`);
    return NextResponse.json(
      {
        success: false,
        errors: [{ message: "Failed to delete temporary bookings." }],
      },
      { status: 500 }
    );
  }
}
