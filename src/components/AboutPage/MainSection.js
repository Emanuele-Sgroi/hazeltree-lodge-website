/**
 * @file MainSection.js
 * @description The MainSection component renders the main section of the About page, which includes information about the owners and the area around Hazeltree Lodge. It displays titles, descriptions, and corresponding images for both the owners and area, arranged in alternating layouts for visual interest.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client"; // This is a client-side component

import React from "react";
import Image from "next/image";

/**
 * MainSection Component
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.smallTitle - The small title for the section header.
 * @param {string} props.bigTitle - The main title for the section (supports line breaks).
 * @param {string} props.description - The description text for the section.
 * @param {string} props.ownersTitle - The title for the "Owners" section.
 * @param {string} props.ownersDescription - The description for the "Owners" section.
 * @param {string} props.ownersImage - The URL for the owners' image.
 * @param {string} props.areaTitle - The title for the "Area" section.
 * @param {string} props.areaDescription - The description for the "Area" section.
 * @param {string} props.areaImage - The URL for the area image.
 *
 * @returns {JSX.Element} The rendered MainSection component.
 */

const MainSection = ({
  smallTitle,
  bigTitle,
  description,
  ownersTitle,
  ownersDescription,
  ownersImage,
  areaTitle,
  areaDescription,
  areaImage,
}) => {
  // Section array for the owners and area information
  const sectionArray = [
    { title: ownersTitle, description: ownersDescription, img: ownersImage },
    { title: areaTitle, description: areaDescription, img: areaImage },
  ];

  return (
    <section className="bg-secondary w-full flex flex-col items-center justify-center py-12 md:py-16 lg:py-20">
      {/* Header with small title, big title, and description */}
      <div className="flex flex-col justify-center items-center gap-2 max-w-[670px] px-6">
        <div className="flex justify-center items-center gap-3">
          <span className="line-h6"></span>
          <h6 className="text-center">{smallTitle.toUpperCase()}</h6>
          <span className="line-h6"></span>
        </div>
        <h2 className="text-center">{bigTitle}</h2>
        <p className="mt-2 text-center">{description}</p>
      </div>

      {/* Section content for owners and area information */}
      <div className="relative w-full mt-8 md:mt-12 lg:mt-20 md:py-4 lg:py-8 flex flex-col gap-8 md:gap-12">
        {sectionArray.map((item, index) => (
          <div
            key={index}
            className={`w-full flex flex-col justify-center gap-6 lg:gap-24 ${
              index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
            } md:px-6`}
          >
            {/* Image section */}
            <div
              className={`w-full md:w-1/2 flex ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div className="w-full md:w-[450px] xl:w-[600px] h-[280px] md:h-[350px] xl:h-[500px] overflow-hidden">
                <Image
                  src={item.img}
                  alt={`${item.title} image`}
                  width={680}
                  height={510}
                  className="w-full h-full transition-all duration-500 ease-in-out hover:scale-[1.1] object-cover object-center"
                />
              </div>
            </div>

            {/* Text section */}
            <div
              className={`w-full md:w-1/2 flex ${
                index % 2 === 0 ? "justify-end" : "justify-start"
              } items-center max-md:px-6`}
            >
              <div className="max-w-full md:max-w-[450px] flex flex-col justify-start gap-4 md:gap-5">
                <div className="flex justify-start items-center gap-3">
                  <span className="line-h6"></span>
                  <h3>{item.title}</h3>
                </div>

                <div className="flex flex-col gap-1 lg:gap-3">
                  {item.description.split("\n").map((line, index) => (
                    <p key={index} className="relative z-20">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Decorative elements */}
        <div className="hidden lg:block size-5 rounded-full border-[#2e3778] bg-secondary border absolute left-1/2 top-[-1.25rem] transform -translate-x-1/2 opacity-20 z-10" />
        <div className="hidden lg:block size-5 rounded-full border-[#2e3778] bg-secondary border absolute bottom-[-1.25rem] left-1/2 transform -translate-x-1/2 z-10 opacity-20" />
        <div className="hidden lg:block h-full w-[0.1px] bg-[#2e3778] absolute left-1/2 top-0 transform -translate-x-1/2 z-0 opacity-20" />
      </div>
    </section>
  );
};

export default MainSection;
