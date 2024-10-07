/**
 * @file HeroSection.js
 * @description Hero section of the homepage that includes a background image carousel, main title, description, and a call-to-action button. It also features a scroll-down indicator and responsive behavior for mobile devices.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSiteContent } from "@/context/SiteContentContext";
import { Header, ButtonPrimary } from "@/components";
import styles from "./Homepage.module.scss";
import { getOptimizedImageUrl } from "@/utils/imageUtils";
import { LiaLongArrowAltDownSolid } from "react-icons/lia";
import { Link as ScrollLink } from "react-scroll";
import Loading from "../Loading/Loading";

const HeroSection = () => {
  const { general, homepage } = useSiteContent();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const heroRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [offset, setOffset] = useState(-90);

  // Handle responsive behavior for mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);

      if (window.innerWidth < 640) {
        setOffset(-61);
      } else {
        setOffset(-90);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Preload images and set loading state
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
          setImagesLoaded(true);
        });
      }
    }
  }, [homepage, isMobile]);

  // Image carousel effect with interval change
  useEffect(() => {
    if (homepage && imagesLoaded) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) =>
            (prevIndex + 1) %
            (isMobile
              ? homepage.heroSectionBackgroundImagesMobile.length
              : homepage.heroSectionBackgroundImages.length)
        );
      }, 7000);

      return () => clearInterval(interval);
    }
  }, [homepage, imagesLoaded, isMobile]);

  // Display a loading overlay until images are fully loaded
  if (!general || !homepage || !imagesLoaded) {
    return <div className="overlay-homepage "></div>;
  }

  const images = isMobile
    ? homepage.heroSectionBackgroundImagesMobile
    : homepage.heroSectionBackgroundImages;

  return (
    <section
      className="relative w-full h-svh min-h-svh flex flex-col justify-between z-10"
      ref={heroRef}
    >
      {/* White layer animation on page load */}
      <div className="fixed w-full min-h-svh z-[9999] animate-dissolve-start duration-500" />

      <Header />

      <div className="relative w-full flex flex-grow justify-center items-center px-6 py-6 overflow-hidden">
        <div className="overlay-layer z-[1]" />
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute flex flex-grow w-full inset-0 overflow-hidden ${
              styles.imagesWrapper
            } ${index === currentImageIndex ? styles.visible : ""} z-0`}
          >
            <Image
              src={getOptimizedImageUrl(image)}
              alt={image.fields.title}
              fill
              className="w-full h-full object-cover object-center"
              quality={100}
              blurDataURL="data:..."
              placeholder="blur"
              priority
            />
          </div>
        ))}

        {/* Hero Content */}
        <div
          className={`${styles.heroContent} flex flex-col justify-center items-center gap-20 z-10 flex-grow`}
        >
          <div className="flex flex-col justify-center items-center text-center">
            <div className="flex justify-center items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <h6 className="text-white">
                {homepage.heroSectionSmallTitle.toUpperCase()}
              </h6>
              <span className="h-px w-8 bg-primary" />
            </div>

            <h1>{homepage.heroSectionMainTitle}</h1>
            <p className="text-2xl font-light text-white mt-3">
              {homepage.heroSectionDescription}
            </p>
          </div>
          <ButtonPrimary text={"BOOK NOW"} isBeige={true} href={"/booking"} />
        </div>

        {/* Scroll Down Indicator */}
        <ScrollLink
          to="overview-section"
          smooth={true}
          duration={1000}
          offset={offset}
          className={`${styles.scrollLink} absolute bottom-6 cursor-pointer flex flex-col justify-center items-center transition-all z-10`}
        >
          <p className="text-white text-s font-normal mb-1">SCROLL</p>
          <LiaLongArrowAltDownSolid
            color="white"
            size={30}
            className="animate-bounce"
          />
        </ScrollLink>
      </div>
    </section>
  );
};

export default HeroSection;
