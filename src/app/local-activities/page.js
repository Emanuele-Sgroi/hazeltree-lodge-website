/**
 * @file page.js
 * @description Renders the Loacl Activities page, showcasing activities and attractions in the local area. The page uses a wrapper component to manage the display and logic of the curated recommendations.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 * @note The page is referred to as "activities" in the CMS.
 */

import React from "react";
import LocalActivitiesWrapper from "@/components/LocalActivitiesPage/LocalActivitiesWrapper";

/**
 * Metadata configuration for SEO and social sharing
 * @typedef {Object} Metadata
 * @property {string} title - The title of the Local Activities page.
 * @property {string} description - A brief description of the Local Activities page content.
 * @property {Object} openGraph - Open Graph metadata for social sharing.
 */

/**
 * @type {Metadata}
 */
export const metadata = {
  title: "Local Activities | Hazeltree Lodge B&B",
  description:
    "Explore a variety of exciting activities and attractions near Hazeltree Lodge in Altans, Co. Sligo. From surfing and golfing to scenic hikes and local cultural experiences, make your stay unforgettable with our curated recommendations.",
  openGraph: {
    title: "Local Activities | Hazeltree Lodge B&B",
    description:
      "Explore a variety of exciting activities and attractions near Hazeltree Lodge in Altans, Co. Sligo. From surfing and golfing to scenic hikes and local cultural experiences, make your stay unforgettable with our curated recommendations.",
    url: "https://www.hazeltreelodge.com/local-activities",
    siteName: "Hazeltree Lodge B&B",
    images: [
      {
        url: "https://www.hazeltreelodge.com/images/og-image.jpg",
        width: 1200,
        height: 451,
        alt: "Local Activities near Hazeltree Lodge B&B in Altans, Co. Sligo",
      },
    ],
    type: "website",
  },
};

/**
 * LocalActivities Component
 *
 * Renders the Local Activities page, displaying curated recommendations for activities and attractions near the area of the venue.
 * The LocalActivitiesWrapper component manages the display and layout of the activities.
 *
 * @returns {JSX.Element} The rendered Local Activities component.
 */
const LocalActivities = () => {
  return (
    <div className="w-full">
      {/* LocalActivitiesWrapper wraps all the content and components of the Local Activities page */}
      <LocalActivitiesWrapper />
    </div>
  );
};

export default LocalActivities;
