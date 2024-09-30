/**
 * @file BreakfastMenuWrapper.js
 * @description Displays the breakfast menu PDF fetched from the CMS within an iframe. Handles mobile detection and adjusts body scrolling accordingly.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useEffect, useState } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import { getAssetUrl } from "@/utils/imageUtils";

/**
 * BreakfastMenuWrapper Component
 *
 * Displays a PDF menu inside an iframe, fetched from the CMS. Disables scrolling when the component is mounted.
 *
 * @returns {JSX.Element} The rendered BreakfastMenuWrapper component.
 */
const BreakfastMenuWrapper = () => {
  const { general } = useSiteContent();
  const [isMobile, setIsMobile] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  useEffect(() => {
    // Detect if the user is on a mobile device
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Prevent body scroll when this component is active
    document.body.style.overflow = "hidden";

    // Set a timeout to reload the page after 3 seconds if iframe hasn't loaded
    const timeoutId = setTimeout(() => {
      if (!isIframeLoaded) {
        window.location.reload(); // Automatically reload the page
      }
    }, 3000); // 3 seconds

    return () => {
      // Re-enable scrolling when this component is unmounted
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [isIframeLoaded]);

  // If general data is not available, show a loading message
  if (!general) {
    return (
      <div className="p-4">
        <p>Please wait...</p>
      </div>
    );
  }

  return (
    <div className="fixed bg-primary w-full min-h-svh h-svh z-[99999]">
      {!isIframeLoaded && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-primary bg-opacity-75">
          <p className="text-dark-blue">Loading menu...</p>
        </div>
      )}
      <iframe
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(
          getAssetUrl(general.breakfastMenu)
        )}&embedded=true`}
        title="Breakfast Menu"
        type="application/pdf"
        allowtransparency="true"
        frameBorder="0"
        className="w-full min-h-svh h-svh"
        onLoad={() => {
          setIsIframeLoaded(true);
          // Optionally, clear any existing timeouts if using multiple timeouts
        }}
        onError={() => {
          setIsIframeLoaded(true); // Stop showing loading overlay
          console.error("Failed to load the Breakfast Menu PDF.");
          // Optionally, you can choose to reload immediately or handle differently
        }}
      ></iframe>
    </div>
  );
};

export default BreakfastMenuWrapper;
