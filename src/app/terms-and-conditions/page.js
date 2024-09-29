/**
 * @file page.js
 * @description Renders the Terms and Conditions page, providing guests with important policies and guidelines for their stay. The page uses a wrapper component to manage the display of the terms and conditions content while managing metadata.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import TermsAndConditionsWrapper from "@/components/TermsAndConditionsPage/TermsAndConditionsWrapper";

/**
 * Metadata configuration for SEO and social sharing
 * @typedef {Object} Metadata
 * @property {string} title - The title of the Terms and Conditions page.
 * @property {string} description - A brief description of the Terms and Conditions page content.
 * @property {Object} openGraph - Open Graph metadata for social sharing.
 */

/**
 * @type {Metadata}
 */
export const metadata = {
  title: "Terms & Conditions | Hazeltree Lodge B&B",
  description:
    "Review the terms and conditions for your stay at Hazeltree Lodge. Understand our policies and guidelines to ensure a comfortable and enjoyable experience.",
  openGraph: {
    title: "Terms & Conditions | Hazeltree Lodge B&B",
    description:
      "Review the terms and conditions for your stay at Hazeltree Lodge. Understand our policies and guidelines to ensure a comfortable and enjoyable experience.",
    url: "https://www.hazeltreelodge.com/terms-and-conditions",
    siteName: "Hazeltree Lodge B&B",
    images: [
      {
        url: "https://www.hazeltreelodge.com/images/og-image.jpg",
        width: 1200,
        height: 451,
        alt: "Terms & Conditions | Hazeltree Lodge B&B",
      },
    ],
    type: "website",
  },
};

/**
 * TermsAndConditions Component
 *
 * Renders the Terms and Conditions page, providing guests with important policies and guidelines for their stay.
 * The TermsAndConditionsWrapper component handles the display of the terms and conditions content.
 *
 * @returns {JSX.Element} The rendered TermsAndConditions component.
 */
const TermsAndConditions = () => {
  return (
    <div className="w-full">
      {/* TermsAndConditionsWrapper wraps all the content and components of the Terms and Conditions page */}
      <TermsAndConditionsWrapper />
    </div>
  );
};

export default TermsAndConditions;
