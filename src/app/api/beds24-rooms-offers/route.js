/**
 * @file route.js
 * @description API route for fetching room availability and prices from the Beds24 API. This route retrieves room offers for specific arrival and departure dates and returns the available rooms and their prices. The request is made to the Beds24 API and returned as JSON.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/tokenManager";

/**
 * Utility function to fetch data from the Beds24 API
 *
 * @param {string} url - The API endpoint URL to fetch data from.
 * @param {string} token - The access token to be included in the API request headers.
 * @returns {Promise<Object>} - The parsed JSON response from the API.
 */
async function fetchFromBeds24(url, token) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}`);
    }

    return await response.json();
  } catch (error) {
    //log the error for debugging
    console.error(`Error fetching Beds24 data: ${error.message}`);
    throw error;
  }
}

/**
 * Handles GET requests for room offers and prices.
 *
 * Fetches room availability and prices from the Beds24 API for the given arrival and departure dates.
 *
 * @param {Request} req - The incoming request object containing query parameters.
 * @returns {NextResponse} JSON response with room availability and prices or an error message.
 */
export async function GET(req) {
  try {
    const token = await getAccessToken();

    const { searchParams } = new URL(req.url);
    const arrival = searchParams.get("arrival");
    const departure = searchParams.get("departure");

    // Validate query parameters
    if (!arrival || !departure) {
      return NextResponse.json(
        {
          error: "Missing required arrival or departure parameters",
        },
        { status: 400 }
      );
    }

    // Construct the Beds24 API URL for room calendar
    const calendarUrl = `https://beds24.com/api/v2/inventory/rooms/calendar?startDate=${arrival}&endDate=${departure}&includeNumAvail=true&includePrices=true`;

    // Fetch the room availability and prices from the Beds24 API
    const calendarData = await fetchFromBeds24(calendarUrl, token);

    // Return the fetched data as JSON response
    return NextResponse.json({
      success: true,
      calendarData, // Return the calendar data
    });
  } catch (error) {
    //log the error for debugging
    console.error(`Error fetching room calendar: ${error.message}`);
    return NextResponse.json(
      { error: "Failed to fetch room calendar" },
      { status: 500 }
    );
  }
}
