/**
 * @file tokenManager.js
 * @description Manages Beds24 API access tokens by refreshing them before expiration. Handles initial token fetching and ensures a valid token is always available for API calls.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import fetch from "node-fetch"; // Import fetch

// Read refresh token from environment variable
let refreshToken = process.env.NEXT_PUBLIC_BEDS24_REFRESH_TOKEN;
let accessToken = ""; // Initially empty, will be fetched dynamically
let expiresIn = 86400; // Default 24 hours (in seconds)

async function refreshAccessToken() {
  try {
    const response = await fetch(
      `https://beds24.com/api/v2/authentication/token`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          refreshToken: refreshToken, // Use the refresh token from the environment variable
        },
      }
    );

    const responseBody = await response.text();
    //console.log("Full Beds24 API Response:", responseBody);

    if (!response.ok) {
      //  console.error("Beds24 API error:", responseBody);
      throw new Error("Failed to refresh token");
    }

    const data = JSON.parse(responseBody);

    // Update the in-memory access token and expiration time
    accessToken = data.token;
    expiresIn = data.expiresIn;

    //console.log("New Access Token:", accessToken);

    // Reset the timer to refresh the token again before it expires
    setTokenRefreshTimer();
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
}

// Function to ensure the access token is available (either fetch a new one or return the existing one)
export async function getAccessToken() {
  // If the access token is empty, fetch a new one
  if (!accessToken) {
    await refreshAccessToken(); // Fetch a new access token
  }
  return accessToken;
}

function setTokenRefreshTimer() {
  // Refresh 10 minutes before expiry (for production use)
  const refreshInterval = (expiresIn - 600) * 1000;
  setTimeout(refreshAccessToken, refreshInterval); // Schedule the next refresh
}

// Start the refresh timer when the server starts
setTokenRefreshTimer();
await refreshAccessToken(); // Fetch a new token initially when the app starts
