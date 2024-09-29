/**
 * @file FinalSection.js
 * @description Final section of the homepage that includes a title, description, an image, and a primary button. It pulls content from the site content context and includes optional decoration and a call-to-action button.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import { getAssetUrl } from "@/utils/imageUtils";
import { ButtonPrimary } from "@/components";
import Image from "next/image";
import images from "@/utils/imageImports";
import { RiArrowRightDoubleLine } from "react-icons/ri";

const FinalSection = ({ button, decoration }) => {
  const { homepage } = useSiteContent();

  return (
    <section className="w-full flex flex-col-reverse md:flex-row justify-center px-6 md:px-8 py-12 md:py-14 lg:py-16 gap-10 lg:gap-8 xl:gap-20">
      {/* Image Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
        <div className="w-full md:w-auto md:max-w-[450px] h-[300px] md:h-[400px] lg:h-[500px] relative border border-dark-blue p-2">
          <Image
            src={getAssetUrl(homepage.finalSectionImage)}
            alt="About Hazeltree Lodge"
            width={450}
            height={500}
            className="w-full h-full object-cover object-center"
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Text Content Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start">
        <div className="flex flex-col relative w-full max-w-full md:max-w-lg text-left gap-6 lg:gap-8">
          <div className="relative flex justify-start lg:justify-start items-center gap-3 z-20">
            <span className="line-h6"></span>
            <h6>{homepage.finalSectionSmallTitle.toUpperCase()}</h6>
          </div>

          {/* Main Title with line breaks */}
          <div>
            {homepage.finalSectionMainTitle.split("\n").map((line, index) => (
              <h2 key={index} className="relative z-20">
                {line}
              </h2>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {/* Description with line breaks */}
            {homepage.finalSectionDescription.split("\n").map((line, index) => (
              <p
                key={index}
                className="text-left flex items-center gap-1 text-2xl font-light"
              >
                <RiArrowRightDoubleLine />
                {line}
              </p>
            ))}
          </div>

          {/* Primary Button */}
          {button && (
            <div className="max-md:self-center max-md:my-3">
              <ButtonPrimary text="BOOK NOW" href={`/booking`} />
            </div>
          )}

          {/* Decorative Image */}
          {decoration && (
            <Image
              src={images.hazeltree_lodge_pictogram_blue}
              alt="About Hazeltree Lodge"
              width={452}
              height={134}
              className="absolute w-[51%] sm:w-[44%] md:w-4/6 xl:w-4/5 h-auto top-2 sm:top-1 md:-top-4 lg:-top-6 xl:-top-10 left-2 z-[1] opacity-8"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default FinalSection;
