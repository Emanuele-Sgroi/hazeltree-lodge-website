/**
 * @file route.js
 * @description API route for updating temporary bookings in Beds24, turning them into proper confirmed bookings. This route handles a POST request that includes an array of booking updates. The request is sent to the Beds24 API, and the response indicates whether the bookings were successfully updated.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/tokenManager";

/**
 * Utility function to update bookings in Beds24.
 *
 * @param {Array} bookingUpdates - Array of booking objects to update.
 * @param {string} token - Beds24 access token.
 * @returns {Array} - Array of update results from Beds24.
 */
async function updateBookingsInBeds24(bookingUpdates, token) {
  try {
    const response = await fetch("https://beds24.com/api/v2/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify(bookingUpdates),
    });

    const responseData = await response.json();

    // Log the full Beds24 API response for debugging
    //console.log("Beds24 API Full Response:", responseData);

    if (!response.ok) {
      //log the error for debugging
      console.error("Beds24 API Error Response:", responseData);
      throw new Error(
        `Failed to update bookings: ${
          responseData.message || response.statusText
        }`
      );
    }

    return responseData;
  } catch (error) {
    //log the error for debugging
    console.error(`Error updating bookings: ${error.message}`);
    throw error;
  }
}

/**
 * API Route Handler for updating bookings in Beds24.
 *
 * Expects a POST request with a JSON body containing an array of booking updates.
 * Validates the booking updates and sends them to Beds24 for processing.
 *
 * @param {Request} req - The incoming request object containing the booking updates.
 * @returns {NextResponse} JSON response indicating success or errors.
 */
export async function POST(req) {
  try {
    const token = await getAccessToken();
    const bookingUpdates = await req.json(); // Get the array of booking updates from the request body

    // Log the incoming booking updates
    //console.log("Booking Updates Received:", bookingUpdates);

    // Validate the incoming data
    if (!Array.isArray(bookingUpdates) || bookingUpdates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          errors: [
            "Invalid booking updates format. Expecting a non-empty array.",
          ],
        },
        { status: 400 }
      );
    }

    // Additional validation for each booking object
    const validationErrors = [];
    bookingUpdates.forEach((booking, index) => {
      if (!booking.id) {
        validationErrors.push(
          `Booking at index ${index} is missing the 'id' field.`
        );
      }
      // More field validations can be added here
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      );
    }

    // Update the bookings in Beds24
    const updateResponse = await updateBookingsInBeds24(bookingUpdates, token);

    // Log the processed update response for debugging
    //console.log("Processed Update Response:", updateResponse);

    // Process the response to determine if all updates were successful
    let allSuccessful = true;
    const errors = [];

    // Beds24 returns an array where each element corresponds to a booking update
    updateResponse.forEach((res, index) => {
      if (!res.success) {
        allSuccessful = false;
        errors.push(
          `Booking ID ${bookingUpdates[index].id} failed to update: ${
            res.message || "Unknown error."
          }`
        );
      }
    });

    if (allSuccessful) {
      return NextResponse.json({
        success: true,
        message: "All bookings updated successfully.",
      });
    } else {
      return NextResponse.json({
        success: false,
        errors: errors,
      });
    }
  } catch (error) {
    //log the error for debugging
    console.error(`Error in update-booking API: ${error.message}`);
    return NextResponse.json(
      { success: false, errors: [error.message] },
      { status: 500 }
    );
  }
}
