/**
 * @file Loading.js
 * @description Renders a loading spinner overlay when the application is in a loading state. This component listens to the global loading state from the LoadingContext and shows or hides the spinner accordingly.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import { useLoading } from "@/context/LoadingContext";
import Image from "next/image";

/**
 * Loading Component
 *
 * Displays a centered spinner overlay when the `isLoading` state is true. The spinner is hidden when loading is complete.
 *
 * @returns {JSX.Element|null} The rendered Loading component or null if not loading.
 */
const Loading = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50">
      <Image
        src="/images/icons/spinner-white.png"
        alt="Searching..."
        width={40}
        height={40}
        quality={100}
        className="animate-spin"
      />
    </div>
  );
};

export default Loading;
