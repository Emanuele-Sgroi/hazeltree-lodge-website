/**
 * @file useBeds24Calendar.js
 * @description Custom hook to fetch calendar data from the Beds24 API based on start and end dates.
 * It manages loading and error states using the LoadingContext and handles data fetching with SWR.
 * A debounced value is used to reduce excessive API calls when the input is rapidly changing.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import useSWR from "swr";
import { useLoading } from "@/context/LoadingContext";
import { useState, useEffect } from "react";
import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";
import Loading from "@/components/Loading/Loading";

/**
 * Custom hook for debouncing input values.
 * This hook delays updating the value until after a given delay, which helps to reduce the number of API calls.
 *
 * @param {any} value - The value that needs to be debounced.
 * @param {number} delay - The delay (in milliseconds) before updating the debounced value.
 * @returns {any} - The debounced value.
 */
function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Fetcher function to fetch data from the Beds24 API.
 * It handles fetching data using the provided URL and checks if the response is OK.
 *
 * @async
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} - The parsed JSON response from the API.
 * @throws Will throw an error if the fetch fails.
 */
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch data from Beds24");
    }
    return res.json();
  });

/**
 * Custom hook to fetch Beds24 calendar data based on the provided start and end dates.
 * It manages loading, success, and error states using SWR (stale-while-revalidate).
 *
 * @param {string} startDate - The start date for the calendar query.
 * @param {string} endDate - The end date for the calendar query.
 * @returns {Object} - The calendar data, loading status, and error status.
 *          - content: JSX component or data.
 *          - lowestPricesPerDay: Object containing the lowest prices per day (fallback to empty object).
 *          - availabilityData: Object containing availability data (fallback to empty object).
 *          - isLoading: Boolean indicating if the content is loading.
 *          - isError: Boolean indicating if there was an error fetching the content.
 */
export const useBeds24Calendar = (startDate, endDate) => {
  const { setIsLoading } = useLoading();

  const url =
    startDate && endDate
      ? `/api/beds24-calendar?startDate=${startDate}&endDate=${endDate}`
      : null;

  const { data, error } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 0,
    onLoadingSlow: () => setIsLoading(true),
    onSuccess: () => setIsLoading(false),
    onError: () => setIsLoading(false),
  });

  if (!data && !error) {
    return { content: <Loading />, isLoading: true, isError: false };
  }

  if (error) {
    return { content: <ErrorComponent />, isLoading: false, isError: true };
  }

  return {
    content: data,
    lowestPricesPerDay: data?.lowestPricesPerDay || {}, // Safe fallback to empty object
    availabilityData: data?.availabilityData || {}, // Safe fallback for availability
    isLoading: false,
    isError: false,
  };
};
