/**
 * @file useTermsContent.js
 * @description Custom hook to fetch the Terms and Conditions page content from Contentful. Handles loading and error states.
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

const fetchTermsContent = async () => {
  const response = await client.getEntries({
    content_type: "termsAndConditionsPage",
    limit: 1,
  });

  if (response.items.length > 0) {
    return response.items[0].fields;
  }
  throw new Error("No content found for the Terms and Conditions page");
};

export const useTermsContent = () => {
  const { setIsLoading } = useLoading();

  const { data, error } = useSWR("termsAndConditionsPage", fetchTermsContent, {
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
