/**
 * @file AboutSection.js
 * @description This component displays the 'About' section of the homepage. It includes a title, description, action buttons, and an image. The content is fetched from a global site content context.
 * @date 20 August 2024
 */

"use client";

import React from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import Image from "next/image";
import { ButtonSecondary } from "@/components";
import { getAssetUrl } from "@/utils/imageUtils";
import images from "@/utils/imageImports";

const AboutSection = () => {
  // Fetch homepage content from context
  const { homepage } = useSiteContent();

  // Get the URL for the about section image, or fallback to an empty string
  const imageUrl =
    homepage && homepage.aboutSectionImage
      ? getAssetUrl(homepage.aboutSectionImage)
      : "";

  return (
    <section
      id="about-section"
      className="w-full flex flex-col md:flex-row justify-center px-6 md:px-8 py-12 md:py-16 lg:py-20 gap-10 lg:gap-8 xl:gap-20"
    >
      {/* Text Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
        <div className="flex flex-col relative w-full max-w-full md:max-w-lg text-left gap-6 lg:gap-8">
          <div className="relative flex justify-start lg:justify-start items-center gap-3 z-20">
            <span className="line-h6"></span>
            <h6>{homepage.aboutSectionSmallTitle.toUpperCase()}</h6>
          </div>

          {/* Main Title with line breaks */}
          <div>
            {homepage.aboutSectionMainTitle.split("\n").map((line, index) => (
              <h2 key={index} className="relative z-20">
                {line}
              </h2>
            ))}
          </div>

          {/* Description */}
          {/* <p>{homepage.aboutSectionDescription}</p> */}
          <div className="flex flex-col justify-start gap-4 z-20">
            {homepage.aboutSectionDescription.split("\n").map((line, index) => (
              <p key={index} className="text-left">
                {line}
              </p>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="w-[60%] relative flex flex-col gap-3 z-20">
            {/* <ButtonSecondary text="EXPLORE MORE" href="/about" /> */}
            <ButtonSecondary text="BOOK A ROOM" href="/booking" />
          </div>

          {/* Decorative Image */}
          <Image
            src={images.hazeltree_lodge_pictogram_blue}
            alt="About Hazeltree Lodge"
            width={452}
            height={134}
            className="absolute w-[51%] sm:w-[44%] md:w-4/6 xl:w-4/5 h-auto top-2 sm:top-1 md:-top-4 lg:-top-6 xl:-top-10 left-2 z-[1] opacity-8"
          />
        </div>
      </div>

      {/* About Section Image */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start">
        <div className="max-w-full md:max-w-[500px] w-full relative border border-dark-blue p-2">
          <Image
            src={imageUrl}
            alt="About Hazeltree Lodge"
            width={500}
            height={635}
            className="w-full h-full max-h-[570px] md:max-h-[635px] object-cover object-center"
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
