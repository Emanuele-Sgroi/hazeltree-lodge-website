/**
 * @file route.js
 * @description API route used to keep the Beds24 token alive by making a request to the Beds24 API. This route is designed to be triggered externally (e.g., by a scheduled task) to prevent the token from expiring if no other API calls are made for 30 days. It makes a simple request to the Beds24 calendar endpoint for a short date range.
 * @note This route is not directly utilized in the website's functionality but is critical for keeping the token active. You can use tools like Vercel's cron jobs to automate these requests.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAccessToken } from "@/utils/tokenManager";

/**
 * Utility function to fetch data from Beds24 API
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
        token: token, // Use the access token in the 'token' header
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
 * Handles GET requests for the keep-alive functionality.
 *
 * This function makes a simple request to the Beds24 API, ensuring that the token does not expire by regularly calling the API.
 *
 * @param {Request} req - The incoming request object.
 * @returns {NextResponse} JSON response confirming the keep-alive success or an error message.
 */
export async function GET(req) {
  try {
    const token = await getAccessToken(); // Ensure that the access token is awaited

    // Define today's date and tomorrow's date
    const startDate = new Date().toISOString().split("T")[0]; // Today's date
    const endDate = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0]; // Tomorrow's date

    const calendarUrl = `https://beds24.com/api/v2/inventory/rooms/calendar?startDate=${startDate}&endDate=${endDate}`;

    // Call Beds24 API and return the raw response without processing
    const calendarData = await fetchFromBeds24(calendarUrl, token);

    // Return a successful response confirming that the keep-alive request worked
    return NextResponse.json({
      success: true,
      message: "Keep-alive request successful",
      data: calendarData,
    });
  } catch (error) {
    //log the error for debugging
    console.error("Error in keep-alive route:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch calendar data from Beds24" },
      { status: 500 }
    );
  }
}
