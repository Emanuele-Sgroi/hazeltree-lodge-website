/**
 * @file page.js
 * @description Renders the Breakfast Menu page, displaying the menu from the CMS in PDF format. The page uses a wrapper component to avoid using the `use client` directive directly on the page while handling metadata.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import BreakfastMenuWrapper from "@/components/BreakfastMenuPage/BreakfastMenuWrapper";

/**
 * Metadata configuration for SEO and social sharing
 * @typedef {Object} Metadata
 * @property {string} title - The title of the Breakfast Menu page.
 * @property {string} description - A brief description of the Breakfast Menu page content.
 * @property {Object} openGraph - Open Graph metadata for social sharing.
 */

/**
 * @type {Metadata}
 */
export const metadata = {
  title: "Breakfast Menu | Hazeltree Lodge B&B",
  description:
    "Breakfast is always included when you book directly. Enjoy our delicious breakfast offerings at Hazeltree Lodge to start your day right.",
  openGraph: {
    title: "Breakfast Menu | Hazeltree Lodge B&B",
    description:
      "Breakfast is always included when you book directly. Enjoy our delicious breakfast offerings at Hazeltree Lodge to start your day right.",
    url: "https://www.hazeltreelodge.com/breakfast-menu",
    siteName: "Hazeltree Lodge B&B",
    images: [
      {
        url: "https://www.hazeltreelodge.com/images/og-image.jpg",
        width: 1200,
        height: 451,
        alt: "Breakfast Menu | Hazeltree Lodge B&B",
      },
    ],
    type: "website",
  },
};

/**
 * BreakfastMenu Component
 *
 * Renders the Breakfast Menu page. It uses the BreakfastMenuWrapper component to display the menu content,
 * which is fetched in PDF (using iFrame) format from the CMS.
 *
 * @returns {JSX.Element} The rendered BreakfastMenu component.
 */
const BreakfastMenu = () => {
  return (
    <div className="w-full">
      {/* BreakfastMenuWrapper wraps the content of the Breakfast Menu page */}
      <BreakfastMenuWrapper />
    </div>
  );
};

export default BreakfastMenu;
