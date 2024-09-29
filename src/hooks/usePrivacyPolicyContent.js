/**
 * @file usePrivacyPolicyContent.js
 * @description Custom hook to fetch and manage content for the Privacy Policy page from Contentful. Manages loading and error states during content fetching.
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

const fetchPrivacyPolicyContent = async () => {
  const response = await client.getEntries({
    content_type: "privacyPolicyPage",
    limit: 1,
  });

  if (response.items.length > 0) {
    return response.items[0].fields;
  }
  throw new Error("No content found for the Privacy Policy page");
};

export const usePrivacyPolicyContent = () => {
  const { setIsLoading } = useLoading();

  const { data, error } = useSWR(
    "privacyPolicyPage",
    fetchPrivacyPolicyContent,
    {
      onLoadingSlow: () => setIsLoading(true),
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    }
  );

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
