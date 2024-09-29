/**
 * @file useBookingContent.js
 * @description Custom hook to fetch and manage the content of the Booking page from Contentful. It handles loading and error states during content fetching.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import useSWR from "swr";
import client from "@/utils/contentfulClient";
import { useLoading } from "@/context/LoadingContext";
import { useEffect } from "react";
import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";
import Loading from "@/components/Loading/Loading";

/**
 * Fetches the content of the Booking page from Contentful
 * @returns {Promise<Object>} The content of the Booking page
 * @throws {Error} If no content is found for the Booking page
 */
const fetchBookingContent = async () => {
  const response = await client.getEntries({
    content_type: "bookingPage",
    //limit: 1,
    include: 3,
  });

  if (response.items.length > 0) {
    return response.items[0].fields;
  }
  throw new Error("No content found for the Booking page");
};

/**
 * Custom hook to fetch and manage Booking page content from Contentful.
 * @returns {Object} Content data, loading state, and error state for the Booking page.
 */
export const useBookingContent = () => {
  const { setIsLoading } = useLoading();

  const { data, error } = useSWR("bookingPage", fetchBookingContent, {
    onLoadingSlow: () => setIsLoading(true),
    onSuccess: () => setIsLoading(false),
    onError: () => setIsLoading(false),
  });

  useEffect(() => {
    setIsLoading(!data && !error);
  }, [data, error, setIsLoading]);

  // Handling the loading and error states directly here
  if (error) {
    return { content: <ErrorComponent />, isLoading: false, isError: true };
  }

  if (!data) {
    return { content: <Loading />, isLoading: true, isError: false };
  }

  return {
    content: data,
    isLoading: false,
    isError: false,
  };
};
