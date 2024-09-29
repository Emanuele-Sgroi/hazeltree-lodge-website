/**
 * @file page.js
 * @description Renders the Booking Confirmation page. This page thanks users for their booking and provides confirmation details. The page uses a wrapper component to handle the display and logic, avoiding the need for the `use client` directive directly on the page while managing metadata.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import ConfirmationWrapper from "@/components/ConfirmationPage/ConfirmationWrapper";

/**
 * Metadata configuration for SEO
 * This function dynamically sets the title and description for the confirmation page.
 *
 * @returns {Object} Metadata object containing the title and description for the Confirmation page.
 */
export const metadata = () => ({
  title: `Booking Confirmation | Hazeltree Lodge B&B`,
  description: `Thank you for booking with Hazeltree Lodge.`,
});

/**
 * ConfirmationPage Component
 *
 * Renders the Booking Confirmation page, displaying the details of the booking.
 * The ConfirmationWrapper component handles the logic and layout for the confirmation page.
 *
 * @returns {JSX.Element} The rendered ConfirmationPage component.
 */
const ConfirmationPage = () => {
  return (
    <div className="w-full">
      {/* ConfirmationWrapper wraps all the content and components of the Confirmation page */}
      <ConfirmationWrapper />
    </div>
  );
};

export default ConfirmationPage;
