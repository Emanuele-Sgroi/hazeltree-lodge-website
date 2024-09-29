/**
 * @file page.js
 * @description Renders the About Us page, providing information about the establishment and its offerings.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import AboutWrapper from "@/components/AboutPage/AboutWrapper";

/**
 * Metadata configuration for SEO and social sharing
 * @typedef {Object} Metadata
 * @property {string} title - The title of the About Us page.
 * @property {string} description - A brief description of the About Us page content.
 * @property {Object} openGraph - Open Graph metadata for social sharing.
 */

/**
 * @type {Metadata}
 */
export const metadata = {
  title: "About Us | Hazeltree Lodge B&B",
  description:
    "At Hazeltree Lodge, we invite you to our cozy Bed & Breakfast in Altans, Co. Sligo. With three comfortable rooms and a warm, friendly atmosphere, we're the perfect spot for your adventures—whether you're into surfing, golfing, or just looking to relax and unwind.",
  openGraph: {
    title: "About Us | Hazeltree Lodge B&B",
    description:
      "At Hazeltree Lodge, we invite you to our cozy Bed & Breakfast in Altans, Co. Sligo. With three comfortable rooms and a warm, friendly atmosphere, we're the perfect spot for your adventures—whether you're into surfing, golfing, or just looking to relax and unwind.",
    url: "https://www.hazeltreelodge.com/about",
    siteName: "Hazeltree Lodge B&B",
    images: [
      {
        url: "https://www.hazeltreelodge.com/images/og-image.jpg",
        width: 1200,
        height: 451,
        alt: "Hazeltree Lodge B&B - About Us",
      },
    ],
    type: "website",
  },
};

/**
 * About Component
 *
 * Renders the About Us page, showcasing information about Hazeltree Lodge B&B.
 * Utilizes the AboutWrapper component to display the content using the client side.
 *
 * @returns {JSX.Element} The rendered About component.
 */
const About = () => {
  return (
    <div className="w-full">
      {/* AboutWrapper component wrap all the components for the About Us page */}
      <AboutWrapper />
    </div>
  );
};

export default About;
