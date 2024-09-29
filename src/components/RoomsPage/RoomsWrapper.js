/**
 * @file RoomsWrapper.js
 * @description Renders the Rooms page, fetching the content from the CMS and displaying the available rooms. It includes the top section with a background image and a list of rooms, using the PageTopSection and RoomsPageComponent components. Handles loading and error states when fetching data from Contentful.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import { useRoomsContent } from "@/hooks/useRoomsContent";
import { PageTopSection, RoomsPageComponent, FinalSection } from "@/components";
import { getAssetUrl } from "@/utils/imageUtils";

/**
 * RoomsWrapper Component
 *
 * This component fetches and displays the Rooms page content, including the top section with a background image and room details.
 * It handles loading and error states and displays a fallback component if necessary.
 *
 * @returns {JSX.Element} The rendered Rooms page component.
 */
const RoomsWrapper = () => {
  const { content, isLoading, isError } = useRoomsContent();

  // If content is a React component (loading or error), render it directly
  if (isLoading || isError) {
    return content;
  }

  const topImgUrl =
    content && content.topSectionBackgroundImage
      ? getAssetUrl(content.topSectionBackgroundImage)
      : "";

  // Access the referenced rooms
  const roomsRef = content?.roomsReference?.map((room) => room.fields);

  return (
    <div className={`w-full`}>
      {/* Top section of the page with background image, title, and description */}
      <PageTopSection
        bgImage={topImgUrl}
        title={content.topSectionTitle}
        description={content.topSectionDescription}
      />
      {/* Rooms page component displaying the list of available rooms */}
      <RoomsPageComponent rooms={roomsRef} />
    </div>
  );
};

export default RoomsWrapper;
