/**
 * @file page.js
 * @description Renders the FAQs (Frequently Asked Questions) page. The page uses a wrapper component to handle the display and logic while managing metadata.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import FaqsWrapper from "@/components/FaqsPage/FaqsWrapper";

/**
 * Metadata configuration for SEO and social sharing
 * @typedef {Object} Metadata
 * @property {string} title - The title of the FAQs page.
 * @property {string} description - A brief description of the FAQs page content.
 * @property {Object} openGraph - Open Graph metadata for social sharing.
 */

/**
 * @type {Metadata}
 */
export const metadata = {
  title: "Frequently Asked Questions | Hazeltree Lodge B&B",
  description:
    "Have questions about your stay at Hazeltree Lodge? Find answers to the most common inquiries about our services, accommodations, and local area in Altans, Co. Sligo.",
  openGraph: {
    title: "Frequently Asked Questions | Hazeltree Lodge B&B",
    description:
      "Have questions about your stay at Hazeltree Lodge? Find answers to the most common inquiries about our services, accommodations, and local area in Altans, Co. Sligo.",
    url: "https://www.hazeltreelodge.com/faqs",
    siteName: "Hazeltree Lodge B&B",
    images: [
      {
        url: "https://www.hazeltreelodge.com/images/og-image.jpg",
        width: 1200,
        height: 451,
        alt: "Frequently Asked Questions | Hazeltree Lodge B&B",
      },
    ],
    type: "website",
  },
};

/**
 * Faqs Component
 *
 * Renders the FAQs page, providing answers to common questions regarding services and accommodations.
 * The FaqsWrapper component handles the display of the frequently asked questions.
 *
 * @returns {JSX.Element} The rendered Faqs component.
 */
const Faqs = () => {
  return (
    <div>
      {/* FaqsWrapper wraps all the content and components of the FAQs page */}
      <FaqsWrapper />
    </div>
  );
};

export default Faqs;
