/**
 * @file page.js
 * @description Renders the Rooms page. The page uses a wrapper component to manage the display and logic for listing the rooms, ensuring a smooth user experience while managing metadata.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import RoomsWrapper from "@/components/RoomsPage/RoomsWrapper";

/**
 * Metadata configuration for SEO and social sharing
 * @typedef {Object} Metadata
 * @property {string} title - The title of the Rooms page.
 * @property {string} description - A brief description of the Rooms page content.
 * @property {Object} openGraph - Open Graph metadata for social sharing.
 */

/**
 * @type {Metadata}
 */
export const metadata = {
  title: "Our Rooms | Hazeltree Lodge B&B",
  description:
    "Discover the comfortable rooms at Hazeltree Lodge in Altans, Co. Sligo. Each room ensures a perfect stay whether you're here to explore the local surf spots, enjoy a round of golf, or simply relax and unwind.",
  openGraph: {
    title: "Our Rooms | Hazeltree Lodge B&B",
    description:
      "Discover the comfortable rooms at Hazeltree Lodge in Altans, Co. Sligo. Each room ensures a perfect stay whether you're here to explore the local surf spots, enjoy a round of golf, or simply relax and unwind.",
    url: "https://www.hazeltreelodge.com/rooms",
    siteName: "Hazeltree Lodge B&B",
    images: [
      {
        url: "https://www.hazeltreelodge.com/images/og-image.jpg",
        width: 1200,
        height: 451,
        alt: "Hazeltree Lodge B&B - Our Comfortable Rooms in Altans, Co. Sligo",
      },
    ],
    type: "website",
  },
};

/**
 * Rooms Component
 *
 * Renders the Rooms page, displaying the various accommodations.
 * The RoomsWrapper component handles the layout and presentation of the rooms.
 *
 * @returns {JSX.Element} The rendered Rooms component.
 */
const Rooms = () => {
  return (
    <div className="w-full">
      {/* RoomsWrapper wraps all the content and components of the Rooms page */}
      <RoomsWrapper />
    </div>
  );
};

export default Rooms;
