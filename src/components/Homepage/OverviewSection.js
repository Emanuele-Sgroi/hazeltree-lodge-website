/**
 * @file OverviewSection.js
 * @description Renders the Overview section of the homepage. It includes carousels for rooms and common areas, with text content, buttons, and a scroll-based parallax effect for additional aesthetics.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import Image from "next/image";
import { ButtonSecondary } from "@/components";
import { getAssetUrl } from "@/utils/imageUtils";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import images from "@/utils/imageImports";

/**
 * OverviewSection Component
 *
 * This component is responsible for rendering the Overview section on the homepage,
 * including carousels for rooms and common areas with descriptions, buttons, and
 * a scroll-based parallax effect to enhance the visual experience.
 *
 * @returns {JSX.Element} The rendered Overview section component.
 */
const OverviewSection = () => {
  const { homepage } = useSiteContent();

  // Room and common area content configuration
  const roomsContent = [
    {
      title: homepage.overviewSectionRoomsTitle,
      text: homepage.overviewSectionRoomsDescription,
      photos: homepage.overviewSectionRoomsImages,
      labels: homepage.overviewSectionRoomsLabels,
    },
  ];

  const areasContent = [
    {
      title: homepage.overviewSectionCommonAreasTitle,
      text: homepage.overviewSectionCommonAreasDescription,
      photos: homepage.overviewSectionCommonAreasImages,
      labels: homepage.overviewSectionCommonAreasLabels,
    },
  ];

  const [roomIndex, setRoomIndex] = useState(0);
  const [areaIndex, setAreaIndex] = useState(0);
  const [roomsCarouselApi, setRoomsCarouselApi] = useState(null);
  const [areasCarouselApi, setAreasCarouselApi] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle carousel index change for rooms
  useEffect(() => {
    if (roomsCarouselApi) {
      const onSelect = () => {
        setRoomIndex(roomsCarouselApi.selectedScrollSnap());
      };
      roomsCarouselApi.on("select", onSelect);

      return () => {
        roomsCarouselApi.off("select", onSelect);
      };
    }
  }, [roomsCarouselApi]);

  // Handle carousel index change for areas
  useEffect(() => {
    if (areasCarouselApi) {
      const onSelect = () => {
        setAreaIndex(areasCarouselApi.selectedScrollSnap());
      };
      areasCarouselApi.on("select", onSelect);

      return () => {
        areasCarouselApi.off("select", onSelect);
      };
    }
  }, [areasCarouselApi]);

  // Retrieve amenities referenced in homepage content
  const amenities = homepage?.overviewSectionAmenitiesReference?.map(
    (amenity) => amenity.fields
  );

  // Configure autoplay for carousels
  const plugin = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    })
  );

  const pluginAreas = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    })
  );

  // Handle scroll position for parallax effect (For moving Image)
  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  // Add scroll event listener
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
    <section
      id="overview-section"
      className="relative w-full bg-primary py-12 md:py-16 lg:py-20 overflow-hidden"
    >
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col justify-center items-center gap-2 max-w-[770px] px-4">
          <div className="flex justify-center items-center gap-3 ">
            <span className="line-h6"></span>
            <h6 className="text-center">
              {homepage.overviewSectionSmallTitle.toUpperCase()}
            </h6>
            <span className="line-h6"></span>
          </div>
          <h2 className="text-center">{homepage.overviewSectionMainTitle}</h2>
        </div>

        {/* Rooms Carousel and Content */}
        <div className="relative w-full flex flex-col md:flex-row justify-center items-center gap-8 xl:gap-16 2xl:gap-20 pt-12 md:pt-20 lg:pt-24">
          <div className="w-full md:w-[51%] z-10">
            {roomsContent.map((item, index) => (
              <div key={index} className="w-full">
                <Carousel
                  setApi={setRoomsCarouselApi}
                  opts={{ loop: true }}
                  plugins={[plugin.current]}
                  className="flex flex-col"
                >
                  <CarouselContent
                    onMouseEnter={() => plugin.current.stop()}
                    onMouseLeave={() => plugin.current.play()}
                  >
                    {item.photos.map((image, imgIndex) => (
                      <CarouselItem
                        key={imgIndex}
                        className="relative w-full h-[280px] md:h-[460px] lg:h-[500px] 2xl:h-[650px] p-0 overflow-hidden"
                      >
                        <Image
                          src={getAssetUrl(image)}
                          alt={`room image ${imgIndex + 1}`}
                          width={680}
                          height={650}
                          className="w-full h-full object-cover object-center md:hover:scale-110 transition-all duration-1000 ease-in-out"
                          quality={100}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Carousel Controls */}
                  <div className="w-full flex justify-between item-center md:pl-8 lg:pl-16 pt-4 md:pr-1 max-md:px-6">
                    <div
                      onMouseEnter={() => plugin.current.stop()}
                      onMouseLeave={() => plugin.current.play()}
                      className="relative max-md:w-full flex gap-6 md:gap-12 max-md:justify-between"
                    >
                      <CarouselPrevious className="w-[35px] relative left-auto top-auto translate-x-0 -translate-y-2 xl:-translate-y-1 bg-transparent border-none hover:bg-transparent text-accent-green hover:text-accent-green active:-translate-x-1" />
                      <p className="text-center font-normal md:hidden">
                        {item.labels[roomIndex].toUpperCase()}{" "}
                      </p>
                      <span className="md:hidden absolute w-[28px] h-[28px] -top-12 -right-5 text-s bg-[#f0f0f0] text-accent-green flex justify-center items-center rounded-full">
                        {roomIndex + 1}/{item.labels.length}
                      </span>
                      <CarouselNext className="w-[35px] relative right-auto top-auto translate-x-0 -translate-y-2 xl:-translate-y-1 bg-transparent border-none hover:bg-transparent text-accent-green hover:text-accent-green active:translate-x-1" />
                    </div>
                    <p className="flex gap-12 text-right font-normal max-md:hidden">
                      {item.labels[roomIndex].toUpperCase()} &nbsp;&nbsp;&nbsp;{" "}
                      <span>
                        {roomIndex + 1}/{item.labels.length}
                      </span>
                    </p>
                  </div>
                </Carousel>
              </div>
            ))}
          </div>
          <div className="w-full md:w-[49%] flex flex-col items-start justify-center md:pr-4 lg:pr-8 max-md:px-6 z-10">
            <div className="relative flex flex-col justify-center items-start gap-4 lg:gap-6 xl:gap-8 max-w-[680px] md:pl-5 lg:pl-10 md:mb-[55.5px]">
              <div className="flex items-center gap-3 z-20">
                <span className="line-h6"></span>
                <h3>{homepage.overviewSectionRoomsTitle.toUpperCase()}</h3>
              </div>
              <div className="flex flex-col justify-start gap-4 z-20">
                {homepage.overviewSectionRoomsDescription
                  .split("\n")
                  .map((line, index) => (
                    <p key={index} className="text-left">
                      {line}
                    </p>
                  ))}
              </div>
              <div className="w-[60%] z-20">
                <ButtonSecondary text="VIEW ROOMS" href={`/rooms`} />
              </div>
              <div className="max-md:hidden size-5 rounded-full border-[#2e3778] bg-secondary border absolute -top-5 left-0 transform -translate-x-1/2 opacity-20 z-10" />
              <div className="max-md:hidden size-5 rounded-full border-[#2e3778] bg-secondary border absolute -bottom-5 left-0 transform -translate-x-1/2 z-10 opacity-20" />
              <div className="max-md:hidden h-full w-[0.1px] bg-[#2e3778] absolute left-0 transform -translate-x-1/2 z-0 opacity-20" />
            </div>
          </div>

          {/* Moving Image - MOBILE */}
          <Image
            src={images.logo_text_blue2}
            alt="Hazeltree Lodge"
            width={0}
            height={0}
            className="md:hidden absolute top-0 xl:top-[-3%] right-[-30%] 2xl:right-[-23%] w-auto h-[50px] sm:h-[60px] md:h-[85px] lg:h-[100px] xl:h-[115px] 2xl:h-[150px] opacity-8 z-0 transition-transform duration-75 ease-out"
            style={{
              transform: `translateX(${scrollPosition * -0.019}%)`,
            }}
          />
        </div>

        {/* Areas Carousel and Content */}
        <div className="relative w-full flex flex-col-reverse md:flex-row justify-center items-center gap-8 xl:gap-16 2xl:gap-20 pt-12 md:pt-20 lg:pt-24">
          <div className="w-full md:w-[49%] flex justify-end items-center md:pl-6 lg:pl-8 px-6 z-10">
            <div className="relative flex flex-col justify-start gap-4 lg:gap-6 xl:gap-8 max-w-[680px] md:pl-5 lg:pl-10 md:mb-[55.5px]">
              <div className="flex items-center gap-3 z-20">
                <span className="line-h6"></span>
                <h3>
                  {homepage.overviewSectionCommonAreasTitle.toUpperCase()}
                </h3>
              </div>
              <div className="flex flex-col justify-start gap-4 z-20">
                {homepage.overviewSectionCommonAreasDescription
                  .split("\n")
                  .map((line, index) => (
                    <p key={index} className="text-left">
                      {line}
                    </p>
                  ))}
              </div>
              <div className="w-[60%] z-20">
                <Link href={"/breakfast-menu"} target="_blank">
                  <button className="btn_secondary">
                    <p className="btn_secondary_text">VIEW MENU</p>
                    <LiaLongArrowAltRightSolid className="btn_secondary_arrow" />
                    <span className="btn_secondary_solid" />
                  </button>
                </Link>
              </div>
              <div className="max-md:hidden size-5 rounded-full border-[#2e3778] bg-secondary border absolute -top-5 left-0 transform -translate-x-1/2 opacity-20 z-10" />
              <div className="max-md:hidden size-5 rounded-full border-[#2e3778] bg-secondary border absolute -bottom-5 left-0 transform -translate-x-1/2 z-10 opacity-20" />
              <div className="max-md:hidden h-full w-[0.1px] bg-[#2e3778] absolute left-0 transform -translate-x-1/2 z-0 opacity-20" />
            </div>
          </div>
          <div className="w-full md:w-[51%] z-10">
            {areasContent.map((item, index) => (
              <div key={index} className="w-full">
                <Carousel
                  setApi={setAreasCarouselApi}
                  opts={{ loop: true }}
                  plugins={[pluginAreas.current]}
                  className="flex flex-col"
                >
                  <CarouselContent
                    onMouseEnter={() => pluginAreas.current.stop()}
                    onMouseLeave={() => pluginAreas.current.play()}
                  >
                    {item.photos.map((image, imgIndex) => (
                      <CarouselItem
                        key={imgIndex}
                        className="relative w-full h-[280px] md:h-[460px] lg:h-[500px] 2xl:h-[650px] p-0 overflow-hidden"
                      >
                        <Image
                          src={getAssetUrl(image)}
                          alt={`room image ${imgIndex + 1}`}
                          width={680}
                          height={650}
                          className="w-full h-full object-cover object-center md:hover:scale-110 transition-all duration-1000 ease-in-out"
                          quality={100}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Carousel Controls */}
                  <div className="w-full flex justify-between item-center md:pr-8 lg:pr-16 pt-4 md:pl-1 max-md:px-6">
                    <p className="flex gap-12 text-right font-normal max-md:hidden">
                      {item.labels[areaIndex].toUpperCase()}
                      <span>
                        {areaIndex + 1}/{item.labels.length}
                      </span>
                    </p>
                    <div
                      onMouseEnter={() => pluginAreas.current.stop()}
                      onMouseLeave={() => pluginAreas.current.play()}
                      className="relative max-md:w-full flex gap-6 md:gap-12 max-md:justify-between"
                    >
                      <CarouselPrevious className="w-[35px] relative left-auto top-auto translate-x-0 -translate-y-2 xl:-translate-y-1 bg-transparent border-none hover:bg-transparent text-accent-green hover:text-accent-green active:-translate-x-1" />
                      <p className="text-center font-normal md:hidden">
                        {item.labels[areaIndex].toUpperCase()}
                      </p>
                      <span className="md:hidden absolute w-[28px] h-[28px] -top-12 -right-5 text-s bg-[#f0f0f0] text-accent-green flex justify-center items-center rounded-full">
                        {areaIndex + 1}/{item.labels.length}
                      </span>
                      <CarouselNext className="w-[35px] relative right-auto top-auto translate-x-0 -translate-y-2 xl:-translate-y-1 bg-transparent border-none hover:bg-transparent text-accent-green hover:text-accent-green active:translate-x-1" />
                    </div>
                  </div>
                </Carousel>
              </div>
            ))}
          </div>

          {/* Moving Image */}
          <Image
            src={images.logo_text_blue2}
            alt="Hazeltree Lodge"
            width={0}
            height={0}
            className="max-md:hidden absolute top-0 xl:top-[-3%] right-[-30%] 2xl:right-[-23%] w-auto h-[85px] lg:h-[100px] xl:h-[115px] 2xl:h-[150px] opacity-8 z-0 transition-transform duration-75 ease-out"
            style={{
              transform: `translateX(${scrollPosition * -0.019}%)`,
            }}
          />
        </div>

        {/* Amenities Section */}
        <div className="w-full flex justify-center px-4 lg:px-8 pt-16 md:pt-20 lg:pt-24">
          <div className="relative flex justify-center flex-wrap gap-8 lg:gap-20 border-[#2e377833] border py-8 px-8 md:px-12">
            <h5 className="absolute -top-4 text-[#101838] bg-primary  px-4">
              {homepage.overviewSectionAmenitiesTitle.toUpperCase()}
            </h5>
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-end gap-2">
                <Image
                  src={getAssetUrl(amenity.amenityIcon)}
                  alt={`${amenity.amenityName} icon`}
                  width={35}
                  height={35}
                  className="max-md:w-[30px] max-md:h-[30px]"
                />
                <p>{amenity.amenityName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
