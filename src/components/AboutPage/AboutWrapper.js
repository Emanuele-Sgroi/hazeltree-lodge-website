/**
 * @file AboutWrapper.js
 * @description This component wraps the entire About page content, fetching and displaying various sections such as the top section, vision section, main section, and bottom section. It dynamically retrieves content and image URLs from a custom hook and ensures that the page is responsive to loading and error states.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client"; // This is a client-side component

import React from "react";
import { useAboutContent } from "@/hooks/useAboutContent";
import {
  PageTopSection,
  VisionSection,
  MainSection,
  BottomSection,
} from "@/components";
import { getAssetUrl } from "@/utils/imageUtils";

const AboutWrapper = () => {
  const { content, isLoading, isError } = useAboutContent(); // Fetch about page content

  // If content is a React component (loading or error), render it directly
  if (isLoading || isError) {
    return content;
  }

  // Retrieve image URLs from content
  const topImgUrl = content?.topSectionBackgroundImage
    ? getAssetUrl(content.topSectionBackgroundImage)
    : "";

  const visionBigImgUrl = content?.visionSectionBigImage
    ? getAssetUrl(content.visionSectionBigImage)
    : "";

  const visionSmallImgUrl = content?.visionSectionSmallImage
    ? getAssetUrl(content.visionSectionSmallImage)
    : "";

  const mainOwnersImgUrl = content?.mainSectionOwnersImage
    ? getAssetUrl(content.mainSectionOwnersImage)
    : "";

  const mainAreaImgUrl = content?.mainSectionAreaImage
    ? getAssetUrl(content.mainSectionAreaImage)
    : "";

  const bottomSectionImgUrl = content?.bottomSectionImage
    ? getAssetUrl(content.bottomSectionImage)
    : "";

  return (
    <div className="w-full">
      {/* Top section with background image, title, and description */}
      <PageTopSection
        bgImage={topImgUrl}
        title={content.topSectionMainTitle}
        description={content.topSectionDescription}
      />

      {/* Vision section with images and description */}
      <VisionSection
        smallTitle={content.visionSectionSmallTitle}
        bigTitle={content.visionSectionMainTitle}
        description={content.visionSectionVisionText}
        imageBig={visionBigImgUrl}
        imageSmall={visionSmallImgUrl}
      />

      {/* Main section with owners and area information */}
      <MainSection
        smallTitle={content.mainSectionSmallTitle}
        bigTitle={content.mainSectionMainTitle}
        description={content.mainSectionDescription}
        ownersTitle={content.mainSectionOwnersTitle}
        ownersDescription={content.mainSectionOwnersDescription}
        ownersImage={mainOwnersImgUrl}
        areaTitle={content.mainSectionAreaTitle}
        areaDescription={content.mainSectionAreaDescription}
        areaImage={mainAreaImgUrl}
      />

      {/* Bottom section with image, title, and description */}
      <BottomSection
        smallTitle={content.bottomSectionSmallTitle}
        bigTitle={content.bottomSectionMainTitle}
        description={content.bottomSectionDescription}
        image={bottomSectionImgUrl}
      />
    </div>
  );
};

export default AboutWrapper;
