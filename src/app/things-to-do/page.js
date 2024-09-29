/**
 * @file page.js
 * @description Renders the Things to Do page, showcasing activities and attractions in the local area. The page uses a wrapper component to manage the display and logic of the curated recommendations.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 * @note The page is referred to as "activities" in the CMS.
 */

import React from "react";
import ThingsToDoWrapper from "@/components/ThingsToDoPage/ThingsToDoWrapper";

/**
 * Metadata configuration for SEO and social sharing
 * @typedef {Object} Metadata
 * @property {string} title - The title of the Things to Do page.
 * @property {string} description - A brief description of the Things to Do page content.
 * @property {Object} openGraph - Open Graph metadata for social sharing.
 */

/**
 * @type {Metadata}
 */
export const metadata = {
  title: "Things to Do | Hazeltree Lodge B&B",
  description:
    "Explore a variety of exciting activities and attractions near Hazeltree Lodge in Altans, Co. Sligo. From surfing and golfing to scenic hikes and local cultural experiences, make your stay unforgettable with our curated recommendations.",
  openGraph: {
    title: "Things to Do | Hazeltree Lodge B&B",
    description:
      "Explore a variety of exciting activities and attractions near Hazeltree Lodge in Altans, Co. Sligo. From surfing and golfing to scenic hikes and local cultural experiences, make your stay unforgettable with our curated recommendations.",
    url: "https://www.hazeltreelodge.com/things-to-do",
    siteName: "Hazeltree Lodge B&B",
    images: [
      {
        url: "https://www.hazeltreelodge.com/images/og-image.jpg",
        width: 1200,
        height: 451,
        alt: "Things to Do near Hazeltree Lodge B&B in Altans, Co. Sligo",
      },
    ],
    type: "website",
  },
};

/**
 * ThingsToDo Component
 *
 * Renders the Things to Do page, displaying curated recommendations for activities and attractions near the area of the venue.
 * The ThingsToDoWrapper component manages the display and layout of the activities.
 *
 * @returns {JSX.Element} The rendered ThingsToDo component.
 */
const ThingsToDo = () => {
  return (
    <div className="w-full">
      {/* ThingsToDoWrapper wraps all the content and components of the Things to Do page */}
      <ThingsToDoWrapper />
    </div>
  );
};

export default ThingsToDo;
