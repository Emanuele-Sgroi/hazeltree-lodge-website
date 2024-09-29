/**
 * @file VisionSection.js
 * @description The VisionSection component displays a visually engaging section with large and small images and responsive text content, showcasing the vision of Hazeltree Lodge. It includes a parallax scrolling effect for the background image to enhance the visual experience.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client"; // This is a client-side component

import React, { useState, useEffect } from "react";
import Image from "next/image";
import images from "@/utils/imageImports";

/**
 * VisionSection Component
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.imageBig - URL of the large image for the section.
 * @param {string} props.imageSmall - URL of the small image for the section.
 * @param {string} props.smallTitle - The small title displayed in the section.
 * @param {string} props.description - The description text, split using '**' for emphasis.
 *
 * @returns {JSX.Element} The rendered VisionSection component.
 */
const VisionSection = ({ imageBig, imageSmall, smallTitle, description }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  /**
   * Handle scroll to update the scroll position for the parallax effect.
   */
  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  // Effect hook to add and remove the scroll event listener
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="relative w-full flex flex-col items-center justify-center py-12 md:py-16 px-8 lg:px-16 overflow-hidden">
      <div className="w-full flex flex-row items-center justify-center z-20">
        {/* Images */}
        <div className="w-1/2 flex items-center justify-end">
          <div className="relative border border-black p-2 max-w-[580px] w-full">
            <Image
              src={imageBig}
              alt="About Hazeltree Lodge"
              width={500}
              height={700}
              className="w-full h-full max-h-auto md:max-h-[800px] object-cover object-center"
              quality={100}
              sizes="(max-width: 500px) 100vw, (max-width: 700px) 50vw, 33vw"
            />
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-start z-20 pl-4">
          <div className="flex flex-col justify-center w-full max-w-[600px] gap-4 md:gap-3">
            <div className="relative w-full md:max-w-[600px]">
              <Image
                src={imageSmall}
                alt="About Hazeltree Lodge"
                width={612}
                height={390}
                className="w-full h-full object-cover object-center"
                quality={100}
              />
            </div>

            {/* Small Title */}
            <div className="max-md:hidden relative flex justify-start items-center gap-3 mt-8 sm:mt-3">
              <span className="line-h6"></span>
              <h6>{smallTitle}</h6>
            </div>

            <div className="max-w-[500px] max-md:hidden ">
              {/* Assuming that the data coming from the cms uses the symbol ** to split the sentence */}
              <h2 className="text-5xl md:text-4xl sm:text-3xl font-bold tracking-wider">
                &quot;
                {description.split("**").map((line, index) => (
                  <span
                    key={index}
                    className={
                      index % 2 === 0 ? "text-black" : "text-accent-orange"
                    }
                  >
                    {line.toUpperCase()}
                  </span>
                ))}
                &quot;
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Text Content */}
      <div className="flex flex-col w-full justify-center items-center text-center mt-4 md:hidden">
        <div className="relative flex justify-start items-center gap-3 mt-8">
          <span className="line-h6"></span>
          <h6>{smallTitle}</h6>
          <span className="line-h6"></span>
        </div>

        <div className="max-w-[450px] text-center">
          {/* Description: The data coming from the cms uses the symbol ** to split the sentence */}
          <h2 className="text-3xl sm:text-2xl font-bold tracking-wider">
            &quot;
            {description.split("**").map((line, index) => (
              <span
                key={index}
                className={
                  index % 2 === 0 ? "text-black" : "text-accent-orange"
                }
              >
                {line}
              </span>
            ))}
            &quot;
          </h2>
        </div>
      </div>

      {/* Parallax Image */}
      <Image
        src={images.logo_text_blue2}
        alt="Hazeltree Lodge"
        width={0}
        height={0}
        className="absolute top-2 right-[-30%] 2xl:right-[-23%] w-auto h-[70px] sm:h-[80px] md:h-[105px] lg:h-[120px] xl:h-[135px] 2xl:h-[170px] opacity-8 z-0 transition-transform duration-75 ease-out"
        style={{
          transform: `translateX(${scrollPosition * -0.019}%)`,
        }}
      />
    </section>
  );
};

export default VisionSection;
