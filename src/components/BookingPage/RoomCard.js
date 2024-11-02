/**
 * @file RoomCard.js
 * @description RoomCard component that displays individual room details, amenities, images, and pricing for the booking process. Handles room selection and booking actions.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client"; // This component runs on the client side

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAssetUrl } from "@/utils/imageUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { VscQuestion } from "react-icons/vsc";
import Modal from "react-modal";
import { RiCloseLargeFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { TiArrowSortedDown } from "react-icons/ti";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link as ScrollLink } from "react-scroll";
import { GrClose } from "react-icons/gr";

// Rich text rendering options for Contentful content
const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="my-[6px]">{children}</p>
    ),
    [BLOCKS.HEADING_5]: (node, children) => (
      <h3 className="text-xl mt-4">{children}</h3>
    ),
    [BLOCKS.HEADING_6]: (node, children) => (
      <h3 className="text-base mt-4">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc pl-4">{children}</ul>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li className="my-[5px]">{children}</li>
    ),
  },
  renderMark: {
    [MARKS.BOLD]: (text) => <span className="font-heavy">{text}</span>,
    [MARKS.ITALIC]: (text) => (
      <span className="italic text-[12px] bg-slate-100 px-1 border border-slate-300 ml-2 rounded-sm text-slate-400">
        {text}
      </span>
    ),
  },
};

/**
 * RoomCard Component
 *
 * Displays individual room details including images, amenities, and pricing. Allows users to select or book rooms directly.
 *
 * @param {Object} cmsRoom - Room data fetched from CMS.
 * @param {Object} apiRoom - Room data from the Beds24 API.
 * @param {Object} cmsResultData - CMS result data (e.g., price info).
 * @param {Object} searchData - Contains check-in, check-out, totalGuestsNumber, totalRoomsNumber, and nightsCount.
 * @param {Array} selectedRooms - List of rooms selected by the user.
 * @param {Function} setSelectedRooms - Function to update selected rooms.
 * @param {Number} roomsLeftToSelect - Number of rooms left to select.
 * @param {Function} setRoomsLeftToSelect - Function to update rooms left to select.
 * @param {Boolean} isShowingAlternatives - Flag to indicate if alternative rooms are shown.
 *
 * @returns {JSX.Element} The rendered RoomCard component.
 */
const RoomCard = ({
  cmsRoom,
  apiRoom,
  cmsResultData,
  searchData,
  selectedRooms,
  setSelectedRooms,
}) => {
  // Initialize guest count with 2
  const [guestCount, setGuestCount] = useState(2);
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTooltip, setIsTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { checkIn, checkOut, nightsCount } = searchData;

  const { priceInfo } = cmsResultData; // Text below price from the CMS (Booking page content)

  // Helper function to get the correct price based on guest count
  const getPriceByGuestCount = () => {
    if (guestCount === 2) return apiRoom.calendar?.[0].price1;
    if (guestCount === 3) return apiRoom.calendar?.[0].price2;
    if (guestCount === 4) return apiRoom.calendar?.[0].price3;
    return apiRoom.calendar?.[0].price1; // Default to price1 if guest count doesn't match
  };

  // Calculated price for display
  const currentPrice = getPriceByGuestCount() * nightsCount;

  const amenities = cmsRoom.amenitiesReference?.map(
    (amenity) => amenity.fields
  );

  // State to check if the room is already selected
  const isRoomSelected = selectedRooms.some(
    (selectedRoom) => selectedRoom.roomId === apiRoom.roomId
  );

  // Function for adding the selected room to checkout - multiple rooms selection
  const handleAddToBooking = () => {
    if (!isRoomSelected) {
      setSelectedRooms([
        ...selectedRooms,
        {
          ...apiRoom,
          guestCount,
          pricePerNight: getPriceByGuestCount(), // Store the correct price for the selected guests
          totalPrice: getPriceByGuestCount() * nightsCount,
        },
      ]);
    }
  };

  // Handle responsive behavior for mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Set modal container in DOM
  useEffect(() => {
    if (typeof window !== "undefined") {
      const appElement = document.getElementById("__next");
      if (appElement) {
        Modal.setAppElement(appElement);
      }
    }
  }, []);

  // Open images modal
  const openImagesModal = () => {
    setIsImagesModalOpen(true);
    setTimeout(() => setIsAnimating(true), 50);
  };

  // Close images modal
  const closeImagesModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsImagesModalOpen(false), 200);
  };

  // Open images modal
  const openDetailsModal = () => {
    setIsDetailsModalOpen(true);
    setTimeout(() => setIsAnimating(true), 50);
  };

  // Close images modal
  const closeDetailsModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsDetailsModalOpen(false), 200);
  };

  // Animate tooltip in mobile
  const handleTooltip = () => {
    setIsTooltip(true);
    setTimeout(() => setIsTooltip(false), 3000);
  };

  return (
    <>
      {cmsRoom && apiRoom && (
        <div className="relative flex flex-grow flex-col border-[#2e3778] border border-opacity-20 overflow-hidden">
          {/* top part */}
          <div className="w-full flex justify-start flex-col lg:flex-row">
            {/* image and info */}
            <div className="flex flex-grow flex-col lg:flex-row max-lg:border-b-[#2e3778] max-lg:border-b max-lg:border-opacity-20 max-lg:border-dashed">
              {/* room image */}
              <div className="relative w-full h-[180px] sm:h-[200px] min-w-full min-h-[180px] sm:min-h-[200px] lg:w-[280px] lg:h-[230px] lg:min-w-[280px] lg:min-h-[220px] overflow-hidden cursor-zoom-in sm:p-4">
                <Image
                  onClick={openImagesModal}
                  src={getAssetUrl(cmsRoom.roomImages?.[0])}
                  alt={`room image ${cmsRoom.roomTitle}`}
                  width={680}
                  height={650}
                  className="w-full h-full object-cover object-center"
                  quality={100}
                />
              </div>
              {/* room info */}
              <div className="flex flex-col justify-start items-start p-2 sm:p-4">
                <h4 className="max-xl:text-base">
                  {cmsRoom.roomTitle.toUpperCase()}
                </h4>

                <div className="flex gap-1 items-start">
                  <span className="relative text-s xl:text-base font-normal text-accent-green">
                    {cmsRoom.roomMinNumberOfGuests === 1 ? (
                      <>Up to {cmsRoom.roomMaxGuests} guests </>
                    ) : (
                      <>
                        Between {cmsRoom.roomMinNumberOfGuests} and{" "}
                        {cmsRoom.roomMaxGuests} guests{" "}
                      </>
                    )}
                    {cmsRoom.roomEnsuite ? "| Ensuite" : "| Dedicated bathroom"}
                    {cmsRoom.roomTipText && cmsRoom.roomTipText.length > 0 && (
                      <>
                        <TooltipProvider
                          delayDuration={400}
                          className={`max-md:hidden`}
                        >
                          <Tooltip className={`max-md:hidden`}>
                            <TooltipTrigger className={`max-md:hidden`}>
                              <VscQuestion className="w-[18px] h-[18px] text-accent-green" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-s text-black font-light">
                                {cmsRoom.roomTipText}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <button className=" md:hidden" onClick={handleTooltip}>
                          <VscQuestion className="w-[18px] h-[18px] text-accent-green" />
                          <span
                            className={`absolute left-1/2 top-[-100%] transform -translate-x-1/2 -translate-y-1/2 min-w-[300px] h-min z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-s text-black font-light text-popover-foreground shadow-md ${
                              isTooltip ? "animate-on" : "animate-off"
                            }`}
                          >
                            {cmsRoom.roomTipText}
                          </span>
                        </button>
                      </>
                    )}
                  </span>
                </div>
                <div className="flex gap-3 mt-2 sm:mt-3">
                  {!isMobile ? (
                    <>
                      {amenities &&
                        amenities.length > 0 &&
                        amenities.map((amenity, index) => (
                          <TooltipProvider delayDuration={400} key={index}>
                            <Tooltip>
                              <TooltipTrigger>
                                {amenity?.amenityIcon && (
                                  <Image
                                    src={getAssetUrl(amenity.amenityIcon)}
                                    alt={`${amenity.amenityName} icon`}
                                    width={25}
                                    height={25}
                                    className="w-[25px] h-[25px]"
                                  />
                                )}
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-s text-black font-light">
                                  {amenity?.amenityName}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                    </>
                  ) : (
                    <>
                      {amenities &&
                        amenities.length > 0 &&
                        amenities.map((amenity, index) => (
                          <Popover key={index}>
                            <PopoverTrigger asChild>
                              {amenity?.amenityIcon && (
                                <Image
                                  src={getAssetUrl(amenity.amenityIcon)}
                                  alt={`${amenity.amenityName} icon`}
                                  width={25}
                                  height={25}
                                  className="w-[25px] h-[25px]"
                                />
                              )}
                            </PopoverTrigger>
                            <PopoverContent className="w-fit p-1">
                              <p className="text-s text-black font-light">
                                {amenity?.amenityName}
                              </p>
                            </PopoverContent>
                          </Popover>
                        ))}
                    </>
                  )}
                </div>
                <RoomDescription description={cmsRoom.roomMainDescription} />
                <button
                  onClick={openDetailsModal}
                  className="text-accent-green underline mt-1 sm:mt-2 max-sm:text-sm"
                >
                  Room Details
                </button>
              </div>
            </div>

            {/* price */}
            <div className="w-full lg:w-[28%] lg:border-l-[#2e3778] lg:border-l lg:border-opacity-20 lg:border-dashed flex flex-col justify-center items-center p-2 sm:p-4">
              <h3>
                €{parseFloat(currentPrice).toFixed(2).replace(/\.00$/, "")}
              </h3>
              {nightsCount > 1 && (
                <p className="text-s text-[#a8a8a8] text-center font-heavy">
                  €
                  {parseFloat(getPriceByGuestCount())
                    .toFixed(2)
                    .replace(/\.00$/, "")}
                  /night
                </p>
              )}
              <div className="flex flex-col justify-center">
                {priceInfo &&
                  priceInfo.split("\n").map((line, index) => (
                    <p
                      key={index}
                      className="text-s text-[#a8a8a8] text-center"
                    >
                      {line}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* bottom part */}
          <div className="w-full bg-secondary border-t-[#2e3778] border-t border-opacity-20 flex max-sm:flex-col max-sm:items-center justify-center sm:justify-end p-2 sm:p-4 gap-6">
            {!isRoomSelected && (
              <div className="flex items-center gap-2">
                <label htmlFor="guest-count" className="text-sm font-semibold">
                  Select the number of guests:
                </label>
                <select
                  id="guest-count"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md p-1 outline-none"
                >
                  {Array.from(
                    {
                      length:
                        cmsRoom.roomMaxGuests -
                        cmsRoom.roomMinNumberOfGuests +
                        1,
                    },
                    (_, i) => i + cmsRoom.roomMinNumberOfGuests
                  ).map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {!isRoomSelected ? (
              <button
                className="max-sm:w-full py-2 px-4 rounded-md bg-dark-blue text-white transform active:scale-95"
                onClick={handleAddToBooking}
              >
                Add to Booking
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                <h6 className="flex gap-1 justify-center items-start font-heavy">
                  <span className="mt-[2px] text-accent-green">
                    <FaCheck />
                  </span>
                  Room Added
                </h6>
                <ScrollLink
                  to="checkout"
                  smooth={true}
                  duration={1000}
                  offset={-90}
                  className="sm:hidden tracking-wider text-s font-semibold underline underline-offset-2 text-accent-green cursor-pointer flex flex-col justify-center items-center gap-0"
                >
                  Go to checkout <TiArrowSortedDown size={20} />
                </ScrollLink>
              </div>
            )}
          </div>

          <ImageModal
            isOpen={isImagesModalOpen}
            onRequestClose={closeImagesModal}
            images={cmsRoom.roomImages}
            isAnimating={isAnimating}
          />
          <DetailsModal
            isOpen={isDetailsModalOpen}
            onRequestClose={closeDetailsModal}
            details={cmsRoom}
            isAnimating={isAnimating}
          />
        </div>
      )}
    </>
  );
};

export default RoomCard;

/**
 * RoomDescription Component
 *
 * Displays a truncated version of the room description text.
 *
 * @param {String} description - Room description text to display.
 *
 * @returns {JSX.Element} The rendered RoomDescription component.
 */
const RoomDescription = ({ description }) => {
  // Truncate the text
  const truncateText = (text, limit) => {
    if (text.length > limit) {
      return `${text.substring(0, limit)}...`;
    }
    return text;
  };

  return (
    <div className="max-w-[95%] mt-3">
      <div className="overflow-hidden transition-all duration-500 ease-in-out">
        <p>{truncateText(description, window.innerWidth < 1060 ? 45 : 98)}</p>
      </div>
    </div>
  );
};

/**
 * ImageModal Component
 *
 * Displays room images in a modal with a carousel.
 *
 * @param {Boolean} isOpen - Determines if the modal is open.
 * @param {Function} onRequestClose - Callback to close the modal.
 * @param {Array} images - Array of room image URLs.
 * @param {Boolean} isAnimating - Controls animation of the modal.
 *
 * @returns {JSX.Element} The rendered ImageModal component.
 */
const ImageModal = ({ isOpen, onRequestClose, images, isAnimating }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false} // Disables hiding app for screen readers when modal is open
      className={`absolute top-[53%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] shadow-lg outline-none focus:outline-none max-lg:w-[95%]  transition-all duration-200 ease-in-out ${
        isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      overlayClassName="fixed inset-0 bg-[#000000bf] backdrop-blur-[2px] z-[9999]"
    >
      <div className="relative w-full lg:max-h-[80vh] flex justify-center items-center">
        {/* Close Button */}
        <button
          onClick={onRequestClose}
          className="absolute -top-14 left-1/2 transform -translate-x-1/2 text-white rounded-full border-2 border-white p-2 cursor-pointer z-[9998]"
          aria-label="Close Modal"
        >
          <GrClose size={29} />
        </button>
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {images.map((image, imgIndex) => (
              <CarouselItem
                key={imgIndex}
                className="flex justify-center lg:max-h-[80vh] items-center"
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
  );
};

/**
 * DetailsModal Component
 *
 * Displays detailed information about a room in a modal.
 *
 * @param {Boolean} isOpen - Determines if the modal is open.
 * @param {Function} onRequestClose - Callback to close the modal.
 * @param {Object} details - Detailed room information.
 * @param {Boolean} isAnimating - Controls animation of the modal.
 *
 * @returns {JSX.Element} The rendered DetailsModal component.
 */
const DetailsModal = ({ isOpen, onRequestClose, details, isAnimating }) => {
  useEffect(() => {
    if (isOpen) {
      // body overflow is hidden when this component is active
      document.body.style.overflow = "hidden";
    }

    return () => {
      // Re-enable scrolling when this component is unmounted
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false} // Disables hiding app for screen readers when modal is open
      className={`bg-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] shadow-lg outline-none focus:outline-none max-lg:w-[90%] max-w-[90%] lg:max-w-[730px] h-[85%] transition-all duration-200 ease-in-out overflow-auto modalScrollBar ${
        isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      overlayClassName="fixed inset-0 bg-[#000000bf] backdrop-blur-[2px] z-[9999]"
    >
      {/* title */}
      <div className="relative w-full flex justify-center items-center py-3 px-4">
        <h2 className="text-black text-4xl">Room Details</h2>
        <button
          onClick={onRequestClose}
          className="absolute right-2  cursor-pointer z-50"
        >
          <RiCloseLargeFill size={25} />
        </button>
      </div>
      <div className="w-full h-[340px] flex justify-start items-center">
        <Carousel opts={{ loop: true }} className={`w-full`}>
          <CarouselContent>
            {details.roomImages.map((image, imgIndex) => (
              <CarouselItem
                key={imgIndex}
                className="w-full h-[340px] flex justify-center items-center"
              >
                <Image
                  src={getAssetUrl(image)}
                  alt={`room image ${imgIndex + 1}`}
                  width={680}
                  height={950}
                  className="w-full h-full object-cover object-center"
                  quality={100}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-75 p-1 w-8 h-8 md:p-2 md:w-10 md:h-10 rounded-full" />
          <CarouselNext className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-75 p-1 w-8 h-8 md:p-2 md:w-10 md:h-10 rounded-full" />
        </Carousel>
      </div>
      <div className="py-2 px-4 flex flex-col">
        <h4>{details.roomTitle}</h4>
        <span className="mt-2">
          {typeof details.roomDetails === "string"
            ? details.roomDetails
            : documentToReactComponents(details.roomDetails, options)}
        </span>
      </div>
    </Modal>
  );
};
