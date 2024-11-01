/**
 * @file BookingWrapper.js
 * @description The BookingWrapper component wraps and handles the entire booking flow for the Hazeltree Lodge website, including displaying search forms, search results, FAQs, and other booking-related content. It interacts with session storage to persist search data and includes a scroll-based parallax effect.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client"; // This is a client-side component

import React, { useState, useEffect } from "react";
import { useBookingContent } from "@/hooks/useBookingContent";
import {
  PageTopSection,
  BookingFaqSection,
  BookingSearchForm,
  BookingSearchResult,
  FinalSection,
} from "@/components";
import Image from "next/image";
import { getAssetUrl } from "@/utils/imageUtils";
import images from "@/utils/imageImports";
import { addMonths } from "date-fns";

/**
 * BookingWrapper Component
 *
 * This component handles the entire booking flow, including:
 * - Top section with a background image, title, and description.
 * - Search form for booking queries.
 * - Display of search results with spinner during loading.
 * - FAQs related to booking.
 *
 * @returns {JSX.Element} The rendered BookingWrapper component.
 */
const BookingWrapper = () => {
  const { content, isLoading, isError } = useBookingContent(); // Hook to fetch booking content
  const [scrollPosition, setScrollPosition] = useState(0); // For parallax effect
  const [searchData, setSearchData] = useState(null); // Store search data
  const [isLoadingSearch, setIsLoadingSearch] = useState(false); // Spinner state

  const maxBookingLimitMonths = content.dataPickerMaxBookingDateInMonths; //Update contentful
  const maxBookingDate = addMonths(new Date(), maxBookingLimitMonths);

  // Group CMS data for the search result
  const cmsResultData = {
    checkInTime: content.resultCheckInTimeInfo,
    checkOutTime: content.resultCheckOutTimeInfo,
    priceInfo: content.resultPriceInfo,
    advantages: content.resultBookDirectAdvantages,
    cancellationPolicy: content.resultCancellationPolicy,
  };

  // Retrieve stored search data from sessionStorage on component mount
  useEffect(() => {
    const storedSearch = sessionStorage.getItem("currentSearch");
    if (storedSearch) {
      try {
        const parsedSearch = JSON.parse(storedSearch);
        setSearchData(parsedSearch); // Populate the searchData state
      } catch (error) {
        console.error("Failed to parse stored search data:", error);
        //Remove corrupted data
        sessionStorage.removeItem("currentSearch");
      }
    }
  }, []);

  /**
   * Handle search form submission
   * @param {Object} data - The search data passed from the form
   */
  const handleSearch = (data) => {
    setIsLoadingSearch(true); // Show the spinner when search starts
    setSearchData(data); // Store the search data received from the child form

    // Persist search data to sessionStorage
    sessionStorage.setItem("currentSearch", JSON.stringify(data));
  };

  /**
   * Handle completion of search
   */
  const handleSearchComplete = () => {
    setIsLoadingSearch(false);
  };

  /**
   * Handle scroll position for parallax effect
   */
  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  // Add scroll event listener for parallax effect
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

  // Render content if loading or error state
  if (isLoading || isError) {
    return content;
  }

  // Retrieve image URLs from content
  const topImgUrl = content?.topSectionBackgroundImage
    ? getAssetUrl(content.topSectionBackgroundImage)
    : "";

  // Access the referenced FAQs and rooms from the content
  const faqsRef = content?.faqReference?.map((faq) => faq.fields);
  const roomsRef = content?.roomsReference?.map((room) => room.fields);

  return (
    <div className="w-full">
      {/* Top section with background image, title, and description */}
      <PageTopSection
        bgImage={topImgUrl}
        title={content.topSectionTitle}
        description={content.topSectionDescription}
      />
      {/* booking search form component */}
      <BookingSearchForm
        showPrices={content.datePickerShowPrices}
        infoText={content.datePickerPricesInfoText}
        maxStay={content.datePickerMaximumStay}
        dayCutoff={content.datePickerDayCutoff}
        maxBookingDate={maxBookingDate}
        showAgeLimitText={content.guestsSelectionShowAgeLimitText}
        ageLimitText={content.guestsSelectionAgeLimitText}
        onSearch={handleSearch}
        initialSearchData={searchData}
      />
      {/* Search result component */}
      <div className="w-full min-h-[500px] justify-center">
        {isLoadingSearch && (
          <div className="w-full flex justify-center px-4 pb-12 lg:pb-16 pt-4 ">
            <Image
              src="/images/icons/spinner-dark-blue.png"
              alt="Searching..."
              width={30}
              height={30}
              quality={100}
              className="animate-spin w-[30px] h-[30px]"
            />
          </div> // Display spinner when loading
        )}

        {!searchData && (
          <div className="w-full flex flex-col justify-center px-4 pb-12 lg:pb-16 pt-4 relative overflow-hidden">
            <p className="text-center">
              No results yet. Please search for available rooms.
            </p>
            <FinalSection button={false} decoration={false} />
            <Image
              src={images.logo_text_blue2}
              alt="Hazeltree Lodge"
              width={0}
              height={0}
              className="absolute bottom-3  right-[-30%] 2xl:right-[-23%] w-auto h-[50px] sm:h-[60px] md:h-[85px] lg:h-[100px] xl:h-[115px] 2xl:h-[150px] opacity-8 z-0 transition-transform duration-75 ease-out"
              style={{
                transform: `translateX(${scrollPosition * -0.019}%)`,
              }}
            />
          </div>
        )}

        {searchData && (
          <BookingSearchResult
            searchData={searchData}
            roomsRef={roomsRef}
            cmsResultData={cmsResultData}
            onSearchComplete={handleSearchComplete} // Pass function to trigger when search is done
          />
        )}
      </div>

      {/* faqs section in booking page */}
      <BookingFaqSection
        smallTitle={content.faqSectionSmallTitle}
        mainTitle={content.faqSectionMainTitle}
        faqsRef={faqsRef}
      />
    </div>
  );
};

export default BookingWrapper;
