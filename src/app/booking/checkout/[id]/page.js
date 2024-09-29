/**
 * @file page.js
 * @description Renders the Checkout page. The page uses a wrapper component to handle the checkout logic and display, avoiding the need for the `use client` directive directly on the page while managing metadata.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import CheckoutWrapper from "@/components/CheckoutPage/CheckoutWrapper";

/**
 * Metadata configuration for SEO
 * This function dynamically sets the title and description for the checkout page.
 *
 * @returns {Object} Metadata object containing the title and description for the Checkout page.
 */
export const metadata = () => ({
  title: `Checkout | Hazeltree Lodge B&B`,
  description: `Complete your booking checkout at Hazeltree Lodge.`,
});

/**
 * CheckoutPage Component
 *
 * Renders the Checkout page.
 * The CheckoutWrapper component handles the checkout logic and display.
 *
 * @returns {JSX.Element} The rendered CheckoutPage component.
 */
const CheckoutPage = () => {
  return (
    <div className="w-full">
      {/* CheckoutWrapper wraps all the content and components of the Checkout page */}
      <CheckoutWrapper />
    </div>
  );
};

export default CheckoutPage;
