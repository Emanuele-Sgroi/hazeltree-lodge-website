/**
 * @file LoadingContext.js
 * @description This context manages and provides the loading state across the entire application. It allows components to easily access and update the loading state to control loading indicators globally. The `LoadingProvider` wraps the application and makes the loading state available to all children components.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { createContext, useContext, useState } from "react";

// Create the context to hold loading state
const LoadingContext = createContext();

/**
 * Custom hook to access the loading context
 *
 * Ensures that the hook is used within a `LoadingProvider`.
 *
 * @returns {Object} The loading context, containing the current loading state and the function to update it.
 * @throws Will throw an error if used outside of the `LoadingProvider`.
 */
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

/**
 * LoadingProvider component
 *
 * Provides the loading state and function to update it across the app.
 * Wraps the application components to allow access to the loading state.
 *
 * @param {React.ReactNode} children - The child components that will have access to the loading context.
 * @returns {JSX.Element} The provider component with context.
 */
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
