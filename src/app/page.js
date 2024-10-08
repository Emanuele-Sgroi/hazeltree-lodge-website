/**
 * @file page.js
 * @description Renders the homepage, assembling various sections to showcase the property's features and offerings.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import {
  HeroSection,
  AboutSection,
  OverviewSection,
  LocalActivitiesSection,
  TestimonialSection,
  FinalSection,
  LocationSection,
} from "@/components";

/**
 * Metadata configuration for SEO and social sharing
 * @typedef {Object} Metadata
 * @property {string} title - The title of the homepage.
 * @property {string} description - A brief description of the homepage content.
 * @property {Object} openGraph - Open Graph metadata for social sharing.
 */

/**
 * @type {Metadata}
 */
export const metadata = {
  title: "A Home Away From Home | Hazeltree Lodge B&B",
  description:
    "Experience comfort and serenity at Hazeltree Lodge, your perfect Bed & Breakfast destination in Altans, Co. Sligo. Ideal for exploring local attractions like surfing and golf or simply relaxing in a friendly, welcoming environment.",
  openGraph: {
    title: "A Home Away From Home | Hazeltree Lodge B&B",
    description:
      "Experience comfort and serenity at Hazeltree Lodge, your perfect Bed & Breakfast destination in Altans, Co. Sligo. Ideal for exploring local attractions like surfing and golf or simply relaxing in a friendly, welcoming environment.",
    url: "https://www.hazeltreelodge.com",
    siteName: "Hazeltree Lodge B&B",
    images: [
      {
        url: "https://www.hazeltreelodge.com/images/og-image.jpg",
        width: 1200,
        height: 451,
        alt: "Hazeltree Lodge B&B - Cozy Accommodations in Altans, Co. Sligo",
      },
    ],
    type: "website",
  },
};

/**
 * Home Component
 *
 * Assembles various sections to create the homepage, providing visitors with an overview of Hazeltree Lodge B&B's offerings.
 *
 * @returns {JSX.Element} The rendered Home component.
 */
export default function Home() {
  return (
    <div>
      {/* Hero section contains welcoming message and visuals */}
      <HeroSection />

      {/* About section */}
      <AboutSection />

      {/* Overview section highlights rooms, common areas and amenities */}
      <OverviewSection />

      {/* Testimonial section showcases guest reviews */}
      <TestimonialSection />

      {/* Local Activities section introduces nearby attractions and activities */}
      <LocalActivitiesSection />

      {/* Location section displays the lodge's location in google map */}
      <LocationSection />

      {/* Located at the bottom, Final section includes a call-to-action button and decorative elements */}
      <FinalSection button={true} decoration={true} />
    </div>
  );
}
