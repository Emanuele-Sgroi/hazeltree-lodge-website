/**
 * @file contentfulClient.js
 * @description Initializes and exports a Contentful client instance for interacting with the Content Delivery API. Uses space ID and access token from environment variables.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import { createClient } from "contentful";

// Initialize the Contentful client with the space ID and access token from environment variables
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export default client;
