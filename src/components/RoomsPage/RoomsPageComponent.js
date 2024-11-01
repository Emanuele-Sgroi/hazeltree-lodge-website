/**
 * @file RoomsPageComponent.js
 * @description Displays room information on the Rooms page, including room details, images, and amenities. It features an image carousel, an amenities accordion, and a modal for viewing images. Also includes tooltips for additional information about rooms.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ButtonPrimary } from "@/components";
import { getAssetUrl } from "@/utils/imageUtils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Modal from "react-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VscQuestion } from "react-icons/vsc";
import { GrClose } from "react-icons/gr";

/**
 * RoomsPageComponent Component
 *
 * Renders a list of rooms, each with a carousel of images, amenities, and a tooltip with additional information.
 * Also handles modal functionality for viewing images in full-screen mode.
 *
 * @param {Object[]} rooms - An array of room objects to display.
 * @returns {JSX.Element} The rendered component displaying room details.
 */
const RoomsPageComponent = ({ rooms }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [modalImageIndex, setModalImageIndex] = useState(0); // State to track the index of the image in the modal
  const [activeSlide, setActiveSlide] = useState(0); // State to track the active slide in the carousel
  const [modalImages, setModalImages] = useState([]); // State to hold the images for the modal
  const [isTooltip, setIsTooltip] = useState(false);

  /**
   * Effect to set the app element for accessibility when the component mounts.
   */
  useEffect(() => {
    // Set the app element for accessibility when the component mounts
    if (typeof window !== "undefined") {
      const appElement = document.getElementById("__next");
      if (appElement) {
        Modal.setAppElement(appElement);
      }
    }
  }, []);

  /**
   * Opens the modal and sets the images to be displayed and the active slide index.
   * @param {string[]} images - The images to display in the modal.
   * @param {number} index - The index of the initial image to display.
   */
  const openModal = (images, index) => {
    // Open the modal with the selected images and set the initial slide
    setModalImages(images);
    setModalImageIndex(index);
    setActiveSlide(index);
    setIsModalOpen(true);
  };

  /**
   * Rearranges the images to display them starting from the active slide.
   * @param {string[]} img - Array of image URLs.
   * @returns {string[]} Reordered array of images.
   */
  const initialModalIndex = (img) => {
    // Reorder the images to start the carousel at the selected image
    return img.slice(activeSlide).concat(img.slice(0, activeSlide));
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // animate tooltip in mobile
  const handleTooltip = () => {
    setIsTooltip(true);
    setTimeout(() => setIsTooltip(false), 3000);
  };

  return (
    <section className="w-full flex flex-col items-center px-2 md:px-8 py-8 md:py-12 lg:py-16 gap-8 md:gap-12 lg:gap-16">
      {rooms &&
        rooms.map((room, index) => {
          const amenities = room.amenitiesReference?.map(
            (amenity) => amenity.fields
          );

          return (
            <div
              key={index}
              className="w-full 2xl:w-[80%] flex flex-col md:flex-row justify-center border-[#2e3778] border border-opacity-20 p-2 lg:p-4 gap-4 lg:gap-8 xl:gap-16"
            >
              {/* Image section */}
              <div className="w-full md:w-1/2">
                <Carousel opts={{ loop: true }}>
                  <CarouselContent>
                    {room.roomImages &&
                      room.roomImages.map((image, imgIndex) => (
                        <CarouselItem
                          key={imgIndex}
                          className="relative w-full h-[320px] md:h-[410px] lg:h-[450px] xl:h-[500px] 2xl:h-[650px] p-0 overflow-hidden cursor-zoom-in"
                          onClick={() => openModal(room.roomImages, imgIndex)}
                        >
                          <Image
                            src={getAssetUrl(image)}
                            alt={`room image ${imgIndex + 1}`}
                            width={680}
                            height={650}
                            className="w-full h-full object-cover object-center md:hover:scale-110 transition-all duration-1000 ease-in-out"
                            quality={100}
                          />
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-3 sm:left-1 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-75 p-1 w-8 h-8 md:p-2 md:w-10 md:h-10 rounded-full" />
                  <CarouselNext className="absolute right-3 sm:right-1 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-75 p-1 w-8 h-8 md:p-2 md:w-10 md:h-10 rounded-full" />
                </Carousel>
              </div>

              {/* Text section */}
              <div className="w-full md:w-1/2 flex flex-col justify-between items-start">
                <div
                  className={`relative flex flex-col justify-center items-start max-w-xl gap-3 lg:gap-5 pt-0 lg:pt-6 pb-2 lg:pb-4`}
                >
                  <div className="flex justify-center items-center gap-3 ">
                    <span className="line-h6"></span>
                    <h3>{room.roomTitle.toUpperCase()}</h3>
                  </div>
                  {room.roomMainDescription.split("\n").map((line, idx) => (
                    <p key={idx} className="text-left">
                      {line}
                    </p>
                  ))}
                  <div className="relative flex gap-1 items-start">
                    <span className="text-base font-normal text-accent-green">
                      {room.roomMinNumberOfGuests === 1 ? (
                        <>Up to {room.roomMaxGuests} guests </>
                      ) : (
                        <>
                          Between {room.roomMinNumberOfGuests} and{" "}
                          {room.roomMaxGuests} guests{" "}
                        </>
                      )}
                      {room.roomEnsuite ? "| Ensuite" : "| Dedicated bathroom"}
                      {room.roomTipText && room.roomTipText.length > 0 && (
                        <>
                          <TooltipProvider
                            delayDuration={400}
                            className={`max-md:hidden`}
                          >
                            <Tooltip className={`max-md:hidden`}>
                              <TooltipTrigger className={`max-md:hidden`}>
                                <VscQuestion size={18} />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-s text-black font-light">
                                  {room.roomTipText}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <button
                            className=" md:hidden"
                            onClick={handleTooltip}
                          >
                            <VscQuestion className="w-[18px] h-[18px] text-accent-green" />
                            <span
                              className={`absolute left-1/2 top-[-100%] transform -translate-x-1/2 -translate-y-1/2 min-w-[300px] h-min z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-s text-black font-light text-popover-foreground shadow-md ${
                                isTooltip ? "animate-on" : "animate-off"
                              }`}
                            >
                              {room.roomTipText}
                            </span>
                          </button>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Amenities Accordion */}
                  {amenities && amenities.length > 0 && (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-1/2 border-b-0 shadow-none"
                    >
                      <AccordionItem
                        value={`amenities`}
                        className="border-b-0 shadow-none"
                      >
                        <AccordionTrigger className="text-lg font-normal text-left border-b-dark-blue border-b p-0">
                          Amenities
                        </AccordionTrigger>
                        <AccordionContent className="w-full border-b-0 shadow-none py-2">
                          <div className="flex flex-col gap-3 border-b-0">
                            {amenities.map((amenity, amIndex) => (
                              <div
                                key={amIndex}
                                className="flex items-center gap-2"
                              >
                                {amenity?.amenityIcon && (
                                  <Image
                                    src={getAssetUrl(amenity.amenityIcon)}
                                    alt={`${amenity.amenityName} icon`}
                                    width={25}
                                    height={25}
                                  />
                                )}
                                <p className="text-base">
                                  {amenity?.amenityName}
                                </p>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>

                {/* Booking Button */}
                <div
                  className={`w-full flex justify-start md:justify-end mt-4 md:mt-1`}
                >
                  <ButtonPrimary text="CHECK AVAILABILITY" href="/booking" />
                </div>
              </div>
            </div>
          );
        })}

      {/* Modal for Viewing Images */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false} // Disables hiding app for screen readers when modal is open
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] shadow-lg outline-none focus:outline-none max-lg:w-[95%]"
        overlayClassName="fixed inset-0 bg-[#000000bf] backdrop-blur-[2px] z-[9999]"
      >
        <div className="relative w-full max-h-[80vh] flex justify-center items-center">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute -top-14 left-1/2 transform -translate-x-1/2 text-white rounded-full border-2 border-white p-2 cursor-pointer z-[9998]"
            aria-label="Close Modal"
          >
            <GrClose size={29} />
          </button>
          <Carousel opts={{ loop: true, initialSlide: activeSlide }}>
            <CarouselContent>
              {initialModalIndex(modalImages).map((image, imgIndex) => (
                <CarouselItem
                  key={imgIndex}
                  className="flex justify-center lg:max-h-[80vh] items-center z-[9997]"
                >
                  <Image
                    src={getAssetUrl(image)}
                    alt={`room image ${imgIndex + 1}`}
                    width={680}
                    height={950}
                    className="w-full h-full object-contain"
                    quality={100}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-75 p-1 w-8 h-8 md:p-2 md:w-10 md:h-10 rounded-full" />
            <CarouselNext className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-75 p-1 w-8 h-8 md:p-2 md:w-10 md:h-10 rounded-full" />
          </Carousel>
        </div>
      </Modal>
    </section>
  );
};

export default RoomsPageComponent;
