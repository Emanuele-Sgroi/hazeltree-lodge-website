/**
 * @file page.js
 * @description Renders the Contact page. This page allows users to get in touch for bookings, inquiries, and assistance. The page uses a wrapper component to handle the display and logic, avoiding the need for the `use client` directive directly on the page while managing metadata.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import ContactWrapper from "@/components/ContactPage/ContactWrapper";

/**
 * Metadata configuration for SEO and social sharing
 * @typedef {Object} Metadata
 * @property {string} title - The title of the Contact page.
 * @property {string} description - A brief description of the Contact page content.
 * @property {Object} openGraph - Open Graph metadata for social sharing.
 */

/**
 * @type {Metadata}
 */
export const metadata = {
  title: "Contact Us | Hazeltree Lodge B&B",
  description:
    "Reach out to Hazeltree Lodge for bookings, inquiries, and any assistance you need to make your stay memorable in Altans, Co. Sligo.",
  openGraph: {
    title: "Contact Us | Hazeltree Lodge B&B",
    description:
      "Reach out to Hazeltree Lodge for bookings, inquiries, and any assistance you need to make your stay memorable in Altans, Co. Sligo.",
    url: "https://www.hazeltreelodge.com/contact",
    siteName: "Hazeltree Lodge B&B",
    images: [
      {
        url: "https://www.hazeltreelodge.com/images/og-image.jpg",
        width: 1200,
        height: 451,
        alt: "Contact Hazeltree Lodge B&B in Altans, Co. Sligo",
      },
    ],
    type: "website",
  },
};

/**
 * Contact Component
 *
 * Renders the Contact page, allowing users to reach out for bookings or assistance.
 * The ContactWrapper component handles the contact form and details display.
 *
 * @returns {JSX.Element} The rendered Contact component.
 */
const Contact = () => {
  return (
    <div className="w-full">
      {/* ContactWrapper wraps all the content and components of the Contact page */}
      <ContactWrapper />
    </div>
  );
};

export default Contact;
