/**
 * @file BottomSection.js
 * @description The BottomSection component renders the final section of the About page, displaying titles, description, action buttons, and an image. It is a client-side component that showcases offerings and provides links to explore rooms, things to do, and booking options.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client"; // This is a client-side component

import React from "react";
import Image from "next/image";
import { ButtonSecondary, ButtonPrimary } from "@/components";
import images from "@/utils/imageImports";

/**
 * BottomSection Component
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.smallTitle - The small title for the section.
 * @param {string} props.bigTitle - The main title for the section (supports line breaks).
 * @param {string} props.description - The description text for the section.
 * @param {string} props.image - The URL for the image displayed in the section.
 *
 * @returns {JSX.Element} The rendered BottomSection component.
 */
const BottomSection = ({ smallTitle, bigTitle, description, image }) => {
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
            <h6>{smallTitle.toUpperCase()}</h6>
          </div>

          {/* Main Title with line breaks */}
          <div>
            {bigTitle.split("\n").map((line, index) => (
              <h2 key={index} className="relative z-20">
                {line}
              </h2>
            ))}
          </div>

          {/* Description */}
          <p>{description}</p>

          {/* Action Buttons */}
          <div className="w-[60%] relative flex flex-col gap-3 z-20">
            <ButtonSecondary text="VIEW ROOMS" href="/rooms" />
            <ButtonSecondary text="THINGS TO DO" href="/things-to-do" />
            {/* <ButtonSecondary text="BOOK NOW" href="/booking" /> */}
          </div>
          <div className="mt-4">
            <ButtonPrimary text={`BOOK NOW`} href={`/booking`} />
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

      {/* Section Image */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start">
        <div className="max-w-full md:max-w-[500px] w-full relative border border-dark-blue p-2">
          <Image
            src={image}
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

export default BottomSection;
