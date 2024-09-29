/**
 * @file beds24.js
 * @description Utility function to retrieve access tokens from Beds24 API using a refresh token.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

const axios = require("axios");

async function getAccessToken(refreshToken) {
  const url = "https://beds24.com/api/v2/authentication/token";

  try {
    const response = await axios.get(url, {
      headers: {
        refreshToken: refreshToken,
        accept: "application/json",
      },
    });

    return response.data.token; // Return the access token
  } catch (error) {
    console.error(
      "Error fetching access token:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to fetch access token");
  }
}

module.exports = { getAccessToken };
