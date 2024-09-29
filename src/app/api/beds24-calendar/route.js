/**
 * @file route.js
 * @description API route for fetching room availability and prices from the Beds24 API. It processes requests for room availability and the lowest prices per day within a given date range. The results are fetched from the Beds24 API and returned as JSON.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { eachDayOfInterval, parseISO, format } from "date-fns"; // For date utility functions
import { getAccessToken } from "@/utils/tokenManager"; // Import token manager

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
        token: token, // Use the token in the 'token' header, as required by Beds24
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
 * Handles GET requests for room availability and lowest prices per day.
 *
 * Fetches room availability and price data from the Beds24 API for a specified date range.
 * If successful, it returns the lowest prices per day along with the availability data.
 *
 * @param {Request} req - The incoming request object containing query parameters.
 * @returns {NextResponse} JSON response with room availability and prices or an error message.
 */
export async function GET(req) {
  try {
    const token = await getAccessToken();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validate the presence of startDate and endDate parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required startDate or endDate parameters" },
        { status: 400 }
      );
    }

    // Construct the URLs for fetching availability and calendar data from Beds24 API
    const availabilityUrl = `https://beds24.com/api/v2/inventory/rooms/availability?startDate=${startDate}&endDate=${endDate}`;
    const calendarUrl = `https://beds24.com/api/v2/inventory/rooms/calendar?startDate=${startDate}&endDate=${endDate}&includePrices=true`;

    // Fetch both availability and calendar data concurrently
    const [availabilityData, calendarData] = await Promise.all([
      fetchFromBeds24(availabilityUrl, token),
      fetchFromBeds24(calendarUrl, token),
    ]);

    // Create a map to store the lowest price for each date
    const lowestPricesPerDay = {};

    // Step 1: Loop through all rooms in the calendar data
    calendarData.data.forEach((room) => {
      // Step 2: Loop through each room's calendar (dates and prices)
      room.calendar.forEach((day) => {
        // Step 3: Expand the date range to individual dates using eachDayOfInterval
        const dates = eachDayOfInterval({
          start: parseISO(day.from),
          end: parseISO(day.to),
        }).map((d) => format(d, "yyyy-MM-dd"));

        // Step 4: For each expanded date, check the price
        dates.forEach((date) => {
          const price = day.price1;

          // Validate that the price is valid (not N/A, null, etc.)
          if (price !== "N/A" && price !== "" && price !== null) {
            // Compare prices and store the lowest price for each day
            if (
              !lowestPricesPerDay[date] ||
              parseFloat(price) < parseFloat(lowestPricesPerDay[date])
            ) {
              lowestPricesPerDay[date] = price; // Store the lowest price for this date
            }
          }
        });
      });
    });

    // Return the lowest prices per day and availability data as JSON
    return NextResponse.json({
      success: true,
      lowestPricesPerDay, // Return the lowest prices for each day
      availabilityData, // Return availability data
    });
  } catch (error) {
    //log the error for debugging
    console.error(`Error fetching Beds24 data: ${error.message}`);
    return NextResponse.json(
      { error: "Failed to fetch room availability or prices" },
      { status: 500 }
    );
  }
}
