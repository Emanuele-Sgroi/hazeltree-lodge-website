/**
 * @file useAboutContent.js
 * @description Custom hook to fetch and provide the About page content from Contentful.
 * It manages loading and error states using the LoadingContext and handles data fetching with SWR (stale-while-revalidate).
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import useSWR from "swr";
import client from "@/utils/contentfulClient";
import { useLoading } from "@/context/LoadingContext";
import { useEffect } from "react";
import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";
import Loading from "@/components/Loading/Loading";

/**
 * Fetches the content for the About page from Contentful.
 *
 * @async
 * @returns {Object} The content fields for the About page.
 * @throws Will throw an error if no content is found.
 */
const fetchAboutContent = async () => {
  const response = await client.getEntries({
    content_type: "aboutPage",
    limit: 1,
  });

  if (response.items.length > 0) {
    return response.items[0].fields;
  }
  throw new Error("No content found for the About page");
};

/**
 * Custom hook to fetch About page content
 *
 * Uses SWR to handle data fetching, caching, and revalidation.
 * The hook manages loading and error states using the LoadingContext.
 *
 * @returns {Object} The About page content, loading status, and error status.
 *          - content: JSX component or data.
 *          - isLoading: Boolean indicating if the content is loading.
 *          - isError: Boolean indicating if there was an error fetching the content.
 */
export const useAboutContent = () => {
  const { setIsLoading } = useLoading();

  const { data, error } = useSWR("aboutPage", fetchAboutContent, {
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
