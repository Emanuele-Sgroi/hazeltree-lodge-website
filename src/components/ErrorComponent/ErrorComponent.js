/**
 * @file ErrorComponent.js
 * @description A fallback UI component that displays a message when the website is unavailable due to an error. This component ensures the user knows something went wrong without crashing the entire application.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useEffect } from "react";

/**
 * ErrorComponent
 * Displays a simple message indicating the website is unavailable due to an error.
 * It also prevents scrolling while this component is visible.
 */
const ErrorComponent = () => {
  useEffect(() => {
    // body overflow is hidden when this component is active
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling when this component is unmounted
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed bg-primary w-full h-svh  z-[999]">
      <div className="fixed bottom-0 right-0 left-0 top-0 w-full h-svh min-h-svh bg-primary flex items-center justify-center p-4">
        <h3 className="text-3xl font-heavy text-center">
          We&apos;re sorry, the website is currently unavailable.
        </h3>
      </div>
    </div>
  );
};

export default ErrorComponent;
