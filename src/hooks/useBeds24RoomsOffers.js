/**
 * @file useBeds24RoomsOffers.js
 * @description Custom hook to fetch room availability and prices from Beds24 based on arrival and departure dates.
 * It manages loading and error states using SWR (stale-while-revalidate).
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import useSWR from "swr";

/**
 * Fetcher function to retrieve data from the provided API URL.
 * It checks if the response is OK before parsing it as JSON.
 *
 * @async
 * @param {string} url - The API URL to fetch data from.
 * @returns {Promise<Object>} - The parsed JSON response from the API.
 * @throws Will throw an error if the fetch operation fails.
 */
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  });

/**
 * Custom hook to fetch room availability and offers from Beds24 based on search criteria (arrival and departure dates).
 * It uses SWR for data fetching and caching, and handles loading, success, and error states.
 *
 * @param {string} arrival - The arrival date for the search.
 * @param {string} departure - The departure date for the search.
 * @returns {Object} - Contains the fetched room data, loading status, and error status.
 *          - data: Array of room availability and offers (fallback to an empty array if no data).
 *          - isLoading: Boolean indicating if the data is being fetched.
 *          - isError: Boolean indicating if there was an error during fetching.
 */
export const useBeds24RoomsOffers = (arrival, departure) => {
  // Construct the API URL based on the search parameters
  const url =
    arrival && departure
      ? `/api/beds24-rooms-offers?arrival=${arrival}&departure=${departure}`
      : null;

  // Use SWR to fetch the data
  const { data, error, isValidating } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Cache data for 60 seconds
  });

  // Return the states and data
  return {
    data: data?.calendarData?.data || [], // Access calendar data from the API response
    isLoading: isValidating, // isValidating means data is being fetched
    isError: !!error,
  };
};
