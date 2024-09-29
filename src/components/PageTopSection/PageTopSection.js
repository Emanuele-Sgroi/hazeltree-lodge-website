/**
 * @file PageTopSection.js
 * @description Renders the top section of a page with a background image, title, and description. The component also includes the site's header and a dark overlay on the background image for better readability of the text. It ensures responsive spacing and proper layout on different screen sizes.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import { Header } from "@/components";

/**
 * PageTopSection Component
 *
 * Displays the top section of a page, featuring a background image, a title, and a description.
 * It includes the Header component and adds an overlay layer to darken the background image for better contrast with the text.
 *
 * @param {string} bgImage - The URL of the background image.
 * @param {string} title - The main title displayed over the background image.
 * @param {string} description - A short description displayed below the title.
 *
 * @returns {JSX.Element} The rendered PageTopSection component.
 */
const PageTopSection = ({ bgImage, title, description }) => {
  return (
    <div className="w-full relative flex flex-col">
      {/* Header component at the top of the page */}
      <Header />
      {/* Spacer for small screens to ensure proper spacing */}
      <div className="md:hidden h-[80px]" />

      {/* Background image section */}
      <div
        className="w-full h-[300px] md:h-[400px] bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        {/* Overlay for darkening the background */}
        <div className="overlay-layer"></div>

        {/* Centered title and description */}
        <div className="w-full h-full flex flex-col justify-center items-center text-center p-6">
          <h1 className="max-w-[800px] z-20">{title}</h1>
          <p className="max-w-[700px] font-light text-white mt-3 z-20">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageTopSection;
