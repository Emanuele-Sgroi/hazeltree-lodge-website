/**
 * @file ContactWrapper.js
 * @description This component is the contact page wrapper. It fetches and displays contact information including the top section, contact details, and location section. It integrates with the CMS to retrieve content dynamically and handles loading and error states.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import { useContactContent } from "@/hooks/useContactContent";
import {
  PageTopSection,
  ContactSection,
  ContactLocationSection,
} from "@/components";
import { getAssetUrl } from "@/utils/imageUtils";
import { useSiteContent } from "@/context/SiteContentContext";

/**
 * ContactWrapper Component
 * This is the main contact page component that renders sections like the top banner, contact details, and location map.
 * It fetches the content via the useContactContent hook and handles loading or error states by rendering the appropriate content.
 */
const ContactWrapper = () => {
  const { content, isLoading, isError } = useContactContent();
  const { general } = useSiteContent();

  // If content is a React component (loading or error), render it directly
  if (isLoading || isError) {
    return content;
  }

  // Get the background image for the top section
  const topImgUrl =
    content && content.topSectionBackgroundImage
      ? getAssetUrl(content.topSectionBackgroundImage)
      : "";

  return (
    <div className={`w-full`}>
      {/* Top section with background image, title, and description */}
      <PageTopSection
        bgImage={topImgUrl}
        title={content.topSectionMainTitle}
        description={content.topSectionDescription}
      />
      {/* Contact details section with phone, email, and address */}
      <ContactSection
        smallTitle={content.contactSectionSmallTitle}
        mainTitle={content.contactSectionMainTitle}
        description={content.contactSectionDescription}
        phonePrefix={general.phonePrefix}
        phoneNumber={general.phoneNumber}
        emailAddress={general.emailAddress}
        addressMapLink={general.addressMapLink}
        address={general.address}
        facebook={general.facebookLink}
      />
      {/* Location section with map */}
      <ContactLocationSection
        smallTitle={content.locationSectionSmallTitle}
        mainTitle={content.locationSectionMainTitle}
        map={general.embeddedMapLink}
      />
    </div>
  );
};

export default ContactWrapper;
