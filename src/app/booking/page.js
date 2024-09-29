/**
 * @file page.js
 * @description Renders the Booking. The page uses a wrapper component to manage booking logic and display, avoiding the need for the `use client` directive directly on the page while handling metadata.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import BookingWrapper from "@/components/BookingPage/BookingWrapper";

/**
 * Metadata configuration for SEO and social sharing
 * @typedef {Object} Metadata
 * @property {string} title - The title of the Booking page.
 * @property {string} description - A brief description of the Booking page content.
 * @property {Object} openGraph - Open Graph metadata for social sharing.
 */

/**
 * @type {Metadata}
 */
export const metadata = {
  title: "Book Your Stay | Hazeltree Lodge B&B",
  description:
    "Reserve your room at Hazeltree Lodge today and enjoy a memorable stay.",
  openGraph: {
    title: "Book Your Stay | Hazeltree Lodge B&B",
    description:
      "Reserve your room at Hazeltree Lodge today and enjoy a memorable stay.",
    url: "https://www.hazeltreelodge.com/booking",
    siteName: "Hazeltree Lodge B&B",
    images: [
      {
        url: "https://www.hazeltreelodge.com/images/booking-og-image.jpg",
        width: 1200,
        height: 451,
        alt: "Book Your Stay | Hazeltree Lodge B&B",
      },
    ],
    type: "website",
  },
};

/**
 * Booking Component
 *
 * Renders the Booking page.
 * The BookingWrapper component handles the booking logic and display.
 *
 * @returns {JSX.Element} The rendered Booking component.
 */
const Booking = () => {
  return (
    <div className="w-full">
      {/* BookingWrapper wraps all the content and components of the booking page */}
      <BookingWrapper />
    </div>
  );
};

export default Booking;
