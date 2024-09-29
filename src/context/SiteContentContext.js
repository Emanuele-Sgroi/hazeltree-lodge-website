/**
 * @file SiteContentContext.js
 * @description Provides general content and homepage content for the website globally.
 * The context ensures content is fetched using SWR (stale-while-revalidate) and is available across the entire site.
 * The fetched content is managed with caching and revalidation, and loading/error states are handled accordingly.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { createContext, useContext } from "react";
import useSWR from "swr";
import client from "@/utils/contentfulClient";
import { useLoading } from "@/context/LoadingContext";
import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";

// Create a context to manage site content (general and homepage)
const SiteContentContext = createContext();

/**
 * Custom hook to use the SiteContentContext
 *
 * Ensures that any component accessing site content is within the `SiteContentProvider`.
 *
 * @returns {Object} The content fetched from the CMS (general and homepage).
 * @throws Will throw an error if used outside of the `SiteContentProvider`.
 */
export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used within a SiteContentProvider");
  }
  return context;
};

/**
 * Fetches content for general site information and homepage.
 *
 * @async
 * @returns {Object} The general site content and homepage content.
 * @throws Will throw an error if content is not found.
 */
const fetchSiteContent = async () => {
  const generalResponse = await client.getEntries({
    content_type: "generalContent",
    limit: 1,
  });

  const homepageResponse = await client.getEntries({
    content_type: "homepage",
    limit: 1,
  });

  // Ensure both general and homepage content are available
  if (generalResponse.items.length > 0 && homepageResponse.items.length > 0) {
    return {
      general: generalResponse.items[0].fields,
      homepage: homepageResponse.items[0].fields,
    };
  }
  throw new Error("No general or homepage content found");
};

/**
 * SiteContentProvider component
 *
 * Provides general site content and homepage content to the rest of the app.
 * Handles loading and error states using SWR.
 *
 * @param {React.ReactNode} children - The child components that will have access to the site content.
 * @returns {JSX.Element} The provider component with the site content context.
 */
export const SiteContentProvider = ({ children }) => {
  const { setIsLoading } = useLoading(); // Access loading state from LoadingContext

  // Fetch site content using SWR for data fetching
  const { data, error } = useSWR("generalContent", fetchSiteContent, {
    onLoadingSlow: () => setIsLoading(true), // Show loading state if fetching is slow
    onSuccess: () => setIsLoading(false), // Hide loading state on success
    onError: () => setIsLoading(false), // Hide loading state on error
  });

  // Show error component if there is an error fetching content
  if (error) {
    return <ErrorComponent />;
  }

  // Render nothing while content is still loading
  if (!data) {
    return null;
  }

  // Provide the fetched site content to the rest of the app
  return (
    <SiteContentContext.Provider value={data}>
      {children}
    </SiteContentContext.Provider>
  );
};
