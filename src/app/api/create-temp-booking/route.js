/**
 * @file route.js
 * @description API route for creating a temporary booking in Beds24. This is used to reserve a spot for a specific room while the user is in the process of completing the booking. It prevents multiple users from booking the same room for the same date simultaneously. The request is made to the Beds24 API and returns the booking IDs.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/tokenManager";

/**
 * Utility function to create a temporary booking in Beds24.
 *
 * @param {Object} bookingData - The booking data to be sent to Beds24.
 * @param {string} token - The access token to be included in the API request headers.
 * @returns {Promise<Object>} - The parsed JSON response from the Beds24 API.
 */
async function createBookingInBeds24(bookingData, token) {
  try {
    const response = await fetch("https://beds24.com/api/v2/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(bookingData), // Send the booking data
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create temporary booking: ${
          errorData.message || response.statusText
        }`
      );
    }

    return await response.json();
  } catch (error) {
    //log the error for debugging
    console.error(`Error creating booking: ${error.message}`);
    throw error;
  }
}

/**
 * Handles POST requests to create a temporary booking.
 *
 * This function processes the incoming request, creates a temporary booking via Beds24 API,
 * and returns the booking IDs to ensure the room is reserved during the checkout process.
 *
 * @param {Request} req - The incoming request object containing the booking data.
 * @returns {NextResponse} JSON response with booking IDs or error messages.
 */
export async function POST(req) {
  try {
    const token = await getAccessToken(); // Fetch the Beds24 access token

    const bookingData = await req.json(); // Get the booking data from the request body

    const bookingResponse = await createBookingInBeds24(bookingData, token);

    // Ensure bookingResponse is an array
    if (!Array.isArray(bookingResponse)) {
      throw new Error("Unexpected response format from Beds24");
    }

    // Extract all booking IDs
    const bookingIds = bookingResponse
      .filter((res) => res.success && res.new && res.new.id)
      .map((res) => res.new.id);

    if (bookingIds.length > 0) {
      return NextResponse.json({
        success: true,
        bookingIds, // Return the array of booking IDs
      });
    } else {
      return NextResponse.json({
        success: false,
        errors: bookingResponse.map((res) => res.errors).filter(Boolean),
      });
    }
  } catch (error) {
    //log the error for debugging
    console.error(`Error in booking API: ${error.message}`);
    return NextResponse.json(
      { error: "Failed to create temporary booking" },
      { status: 500 }
    );
  }
}
