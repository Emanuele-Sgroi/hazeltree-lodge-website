/**
 * @file page.js
 * @description Renders the Privacy Policy page, informing users about how personal information is collected, used, and protected. The page uses a wrapper component to handle the display and logic while managing metadata.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import PrivacyPolicyWrapper from "@/components/PrivacyPolicyPage/PrivacyPolicyWrapper";

/**
 * Metadata configuration for SEO and social sharing
 * @typedef {Object} Metadata
 * @property {string} title - The title of the Privacy Policy page.
 * @property {string} description - A brief description of the Privacy Policy page content.
 * @property {Object} openGraph - Open Graph metadata for social sharing.
 */

/**
 * @type {Metadata}
 */
export const metadata = {
  title: "Privacy Policy | Hazeltree Lodge B&B",
  description:
    "At Hazeltree Lodge, we prioritize your privacy. Read our Privacy Policy to understand how we collect, use, and protect your personal information during your stay.",
  openGraph: {
    title: "Privacy Policy | Hazeltree Lodge B&B",
    description:
      "At Hazeltree Lodge, we prioritize your privacy. Read our Privacy Policy to understand how we collect, use, and protect your personal information during your stay.",
    url: "https://www.hazeltreelodge.com/privacy-policy",
    siteName: "Hazeltree Lodge B&B",
    images: [
      {
        url: "https://www.hazeltreelodge.com/images/og-image.jpg",
        width: 1200,
        height: 451,
        alt: "Privacy Policy | Hazeltree Lodge B&B",
      },
    ],
    type: "website",
  },
};

/**
 * PrivacyPolicy Component
 *
 * Renders the Privacy Policy page, informing users about how personal data is collected and protected.
 * The PrivacyPolicyWrapper component handles the display of the privacy policy content.
 *
 * @returns {JSX.Element} The rendered PrivacyPolicy component.
 */
const PrivacyPolicy = () => {
  return (
    <div className="w-full">
      {/* PrivacyPolicyWrapper wraps all the content and components of the Privacy Policy page */}
      <PrivacyPolicyWrapper />
    </div>
  );
};

export default PrivacyPolicy;
