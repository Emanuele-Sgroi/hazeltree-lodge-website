/**
 * @file LocalActivitiesSection.js
 * @description Renders the Local Activities section of the homepage, showcasing activities and attractions around the location. It handles dynamic image loading based on screen size and includes a decorative wave shape element.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useState, useEffect } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import Link from "next/link";
import { getOptimizedImageUrl } from "@/utils/imageUtils";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

/**
 * LocalActivitiesSection Component
 *
 * Displays an introduction to local activities with a link to the "Local Activities" page. The background image dynamically changes based on screen size.
 *
 * @returns {JSX.Element} The rendered LocalActivitiesSection component.
 */
const LocalActivitiesSection = () => {
  const { homepage } = useSiteContent();
  const [isMobile, setIsMobile] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle screen resizing to determine if the view is mobile or desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Preload background images depending on the screen size
  useEffect(() => {
    if (homepage) {
      const images = isMobile
        ? homepage.heroSectionBackgroundImagesMobile
        : homepage.heroSectionBackgroundImages;

      if (images) {
        const imagePreloadPromises = images.map(
          (image) =>
            new Promise((resolve) => {
              const img = new window.Image();
              img.src = getOptimizedImageUrl(image);
              img.onload = resolve;
            })
        );

        Promise.all(imagePreloadPromises).then(() => {
          setImageLoaded(true);
        });
      }
    }
  }, [homepage, isMobile]);

  // Select the appropriate background image based on the device type
  const selectedImage = isMobile
    ? homepage.activitiesSectionBackgroundImageMobile
    : homepage.activitiesSectionBackgroundImage;

  return (
    <section className="relative w-full h-80 min-h-svh z-10">
      <div className="relative z-[5] w-full h-full flex items-end py-12 md:py-16 lg:py-20 md:px-4">
        <div className="w-full lg:w-[50%] relative flex justify-start lg:justify-end items-center md:pl-6 lg:pl-8 px-6 z-20">
          <div className="relative max-w-[450px] lg:max-w-[680px] flex flex-col justify-start gap-4 lg:gap-6 xl:gap-8 md:pl-5 lg:pl-10">
            <div className="relative flex items-center gap-3 z-20">
              <span className="line-h6" style={{ background: "#fff" }}></span>
              <h6 className="text-white">
                {homepage.activitiesSectionSmallTitle.toUpperCase()}
              </h6>
            </div>
            <h2 className="text-white">
              {homepage.activitiesSectionMainTitle}
            </h2>

            <div className="flex flex-col justify-start gap-4 z-20">
              {homepage.activitiesSectionsDescription
                .split("\n")
                .map((line, index) => (
                  <p key={index} className="text-left text-white">
                    {line}
                  </p>
                ))}
            </div>
            <div className="w-[60%] z-20">
              <Link href="/local-activities">
                <button className="btn_secondary">
                  <p className="btn_secondary_text" style={{ color: "#fff" }}>
                    VISIT
                  </p>
                  <LiaLongArrowAltRightSolid
                    color="#fff"
                    className="btn_secondary_arrow"
                  />
                  <span
                    className="btn_secondary_solid"
                    style={{ background: "#fff" }}
                  />
                </button>
              </Link>
            </div>
            {/* Decorative elements */}
            <div className="max-md:hidden size-5 rounded-full border-[#ffffff] border absolute -top-5 left-0 transform -translate-x-1/2 opacity-20 z-10" />
            <div className="max-md:hidden size-5 rounded-full border-[#ffffff] border absolute -bottom-5 left-0 transform -translate-x-1/2 z-10 opacity-20" />
            <div className="max-md:hidden h-full w-[0.1px] bg-[#ffffff] absolute left-0 transform -translate-x-1/2 z-0 opacity-20" />
          </div>
        </div>
      </div>

      {/* Decorative wave shape */}
      <div className="custom-shape-divider-top-1724970874">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="shape-fill"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="shape-fill"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
      {/* Background overlay and image */}
      <div className="overlay-layer2 h-full z-[2]" />
      <div
        className="absolute top-0 right-0 w-full h-full background-fixed z-0"
        style={{
          backgroundImage: `url(${getOptimizedImageUrl(selectedImage)})`,
        }}
      />
    </section>
  );
};

export default LocalActivitiesSection;
