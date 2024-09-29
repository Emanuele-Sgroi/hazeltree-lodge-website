/**
 * @file useActivitiesContent.js
 * @description Custom hook to fetch and provide the Activities page content from Contentful.
 * It manages loading and error states using the LoadingContext and handles data fetching with SWR (stale-while-revalidate).
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
 * Fetches the content for the Activities page from Contentful.
 *
 * @async
 * @returns {Object} The content fields for the Activities page.
 * @throws Will throw an error if no content is found.
 */
const fetchActivitiesContent = async () => {
  const response = await client.getEntries({
    content_type: "activitiesPage",
    limit: 1,
  });

  if (response.items.length > 0) {
    return response.items[0].fields;
  }
  throw new Error("No content found for the Activities page");
};

/**
 * Custom hook to fetch Activities page content
 *
 * Uses SWR to handle data fetching, caching, and revalidation.
 * The hook manages loading and error states using the LoadingContext.
 *
 * @returns {Object} The Activities page content, loading status, and error status.
 *          - content: JSX component or data.
 *          - isLoading: Boolean indicating if the content is loading.
 *          - isError: Boolean indicating if there was an error fetching the content.
 */
export const useActivitiesContent = () => {
  const { setIsLoading } = useLoading();

  // Fetch Activities page content using SWR (stale-while-revalidate)
  const { data, error } = useSWR("activitiesPage", fetchActivitiesContent, {
    onLoadingSlow: () => setIsLoading(true), // Set loading to true if data is slow to load
    onSuccess: () => setIsLoading(false), // Set loading to false once data is fetched
    onError: () => setIsLoading(false), // Set loading to false if an error occurs
  });

  // Update loading state based on data or error changes
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

  // Return the content once it's fetched
  return {
    content: data,
    isLoading: false,
    isError: false,
  };
};
