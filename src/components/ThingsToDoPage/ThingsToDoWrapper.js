/**
 * @file ThingsToDoWrapper.js
 * @description Renders the Things to Do (Activities) page. This page displays various activities that users can engage in during their stay. It includes a top section with a background image, title, and description, and then lists the activities fetched from the CMS (referred to as "activities" in the CMS).
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import { useActivitiesContent } from "@/hooks/useActivitiesContent";
import { PageTopSection, ThingsToDoComponent } from "@/components";
import { getAssetUrl } from "@/utils/imageUtils";

/**
 * ThingsToDoWrapper Component
 *
 * This component handles the display of the Things to Do (Activities) page.
 * It fetches the content from the CMS and renders the top section with a background image,
 * title, and description. It then displays a list of activities retrieved from the CMS.
 *
 * @returns {JSX.Element} The rendered Things to Do page.
 */
const ThingsToDoWrapper = () => {
  const { content, isLoading, isError } = useActivitiesContent();

  // If content is a React component (loading or error), render it directly
  if (isLoading || isError) {
    return content;
  }

  const topImgUrl =
    content && content.topSectionBackgroundImage
      ? getAssetUrl(content.topSectionBackgroundImage)
      : "";

  // Access the referenced activities
  const activitiesRef = content?.activitiesReference?.map(
    (activity) => activity.fields
  );

  return (
    <div className={`w-full`}>
      <PageTopSection
        bgImage={topImgUrl}
        title={content.topSectionTitle}
        description={content.topSectionDescription}
      />
      <ThingsToDoComponent activities={activitiesRef} />
    </div>
  );
};

export default ThingsToDoWrapper;
