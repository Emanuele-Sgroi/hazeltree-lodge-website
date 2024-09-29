/**
 * @file useContactContent.js
 * @description Custom hook to fetch and manage the content of the Contact page from Contentful. Handles loading and error states during content fetching.
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

const fetchContactContent = async () => {
  const response = await client.getEntries({
    content_type: "contactPage",
    limit: 1,
  });

  if (response.items.length > 0) {
    return response.items[0].fields;
  }
  throw new Error("No content found for the Contact page");
};

export const useContactContent = () => {
  const { setIsLoading } = useLoading();

  const { data, error } = useSWR("roomsPage", fetchContactContent, {
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
