/**
 * @file LocalActivitiesComponent.js
 * @description Renders the "Local Activities" section, displaying categorized activities with pagination. Allows users to filter activities by category and navigate through paginated results. The component adapts to mobile and desktop views, providing a dropdown on mobile for category selection.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAssetUrl } from "@/utils/imageUtils";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * LocalActivitiesComponent
 *
 * Displays a list of activities, filtered by categories, with pagination controls for navigating through multiple activities.
 * It supports both mobile and desktop views, with a category dropdown on mobile and a set of buttons for desktop.
 *
 * @param {Object[]} activities - List of activities to display.
 * @returns {JSX.Element} The rendered Local Activities section.
 */
const LocalActivitiesComponent = ({ activities }) => {
  // State variables to manage categories, pagination, and transitions
  const [categoryActive, setCategoryActive] = useState("View All");
  const [categoryName, setCategoryName] = useState("View All");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  const [pageActive, setPageActive] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Remove duplicate categories from the activities list
  const removeDuplicateCategories = () => {
    let categories = [];
    activities.forEach((cat) => categories.push(cat.activityCategory[0]));
    return [...new Set(categories)];
  };

  // Handle category change with a transition effect
  const handleCategoryChange = (cat) => {
    setIsTransitioning(true);
    setCategoryName(cat);
    setTimeout(() => {
      setCategoryActive(cat);
      setIsTransitioning(false);
      setCurrentPage(1);
    }, 500);
  };

  // Filter activities based on the selected category
  const filteredActivities =
    categoryActive === "View All"
      ? activities
      : activities.filter(
          (item) => item.activityCategory[0] === categoryActive
        );

  // Get the activities to display on the current page
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedActivities = filteredActivities.slice(
    startIndex,
    startIndex + pageSize
  );

  // Handle page change with scroll to top
  const handlePageChange = (page) => {
    setPageTransition(true);
    setPageActive(page);
    setTimeout(() => {
      setCurrentPage(page);
      setPageTransition(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };

  // Navigate to the next page
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredActivities.length / pageSize)) {
      handlePageChange(currentPage + 1);
    }
  };

  // Navigate to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <section className="w-full flex flex-col items-center justify-center overflow-hidden pb-12">
      {/* Category selection for larger screens */}
      <div className="hidden md:flex justify-center items-center flex-wrap gap-6 max-w-[1200px] mt-8">
        <button
          disabled={categoryName === "View All"}
          onClick={() => handleCategoryChange("View All")}
        >
          <p
            className={`font-normal tracking-wider ${
              categoryName === "View All"
                ? "text-[#367a35] underline underline-offset-2"
                : "hover:underline underline-offset-2"
            }`}
          >
            View All
          </p>
        </button>
        {removeDuplicateCategories().map((cat, index) => (
          <div key={index} className="flex gap-8">
            <span className="w-px h-[30px] bg-[#2e3778] opacity-20"></span>
            <button
              disabled={categoryName === cat}
              onClick={() => handleCategoryChange(cat)}
            >
              <p
                className={`font-normal tracking-wider ${
                  categoryName === cat
                    ? "text-[#367a35] underline underline-offset-2"
                    : "hover:underline underline-offset-2"
                }`}
              >
                {cat}
              </p>
            </button>
          </div>
        ))}
      </div>

      {/* Category selection for mobile screens */}
      <div className="md:hidden w-full flex justify-center mt-8">
        <Select
          defaultValue={categoryName}
          onValueChange={(value) => handleCategoryChange(value)}
        >
          <SelectTrigger className="w-11/12 focus:outline-none focus:shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem disabled={categoryName === "View All"} value="View All">
              View All
            </SelectItem>
            {removeDuplicateCategories().map((cat, index) => (
              <SelectItem
                key={index}
                disabled={categoryName === cat}
                value={cat}
              >
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display activities based on selected category and page */}
      <div
        className={`relative w-full flex flex-col justify-center items-center mt-8 md:mt-16 transition-all duration-500 ${
          isTransitioning
            ? "translate-y-10 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div
          className={`relative w-full flex flex-col justify-center items-center transition-opacity duration-200 mt-4 md:py-4 lg:py-8 gap-8 md:gap-12 ${
            pageTransition ? "opacity-0" : "opacity-100"
          }`}
        >
          {paginatedActivities.map((item, index) => (
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
                    src={getAssetUrl(item.activityImage)}
                    alt={`${item.activityName} image`}
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
                <div className="max-w-full md:max-w-[450px] flex flex-col justify-start gap-6 md:gap-5">
                  <div className="flex justify-start items-center gap-3">
                    <span className="line-h6"></span>
                    <h3>{item.activityName}</h3>
                  </div>

                  <div className="flex flex-col gap-1 lg:gap-3">
                    <p className="relative z-20">{item.activityDescription}</p>
                  </div>
                  <div className="w-[60%] relative flex flex-col gap-3 z-20">
                    <Link href={item.activityLink} target="_blank">
                      <button className="btn_secondary">
                        <p className="btn_secondary_text">VISIT</p>
                        <LiaLongArrowAltRightSolid className="btn_secondary_arrow" />
                        <span className="btn_secondary_solid" />
                      </button>
                    </Link>
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
      </div>

      {/* Pagination controls */}
      {filteredActivities.length > pageSize && (
        <div className="w-full flex justify-center items-center flex-wrap gap-2 md:gap-3 mt-12">
          <button
            onClick={handlePreviousPage}
            disabled={pageActive === 1}
            className={`font-normal ${
              pageActive === 1
                ? "text-gray-500"
                : "text-black hover:underline underline-offset-2"
            } transition-all`}
          >
            PREV
          </button>

          {[...Array(Math.ceil(filteredActivities.length / pageSize))].map(
            (_, i) => (
              <button
                key={i}
                disabled={pageActive === i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-8 md:w-10 h-8 md:h-10 ${
                  pageActive === i + 1
                    ? "text-white bg-accent-green rounded-full font-heavy"
                    : "hover:underline underline-offset-2 font-normal"
                }`}
              >
                {i + 1}
              </button>
            )
          )}

          <button
            onClick={handleNextPage}
            disabled={
              pageActive === Math.ceil(filteredActivities.length / pageSize)
            }
            className={`font-normal ${
              pageActive === Math.ceil(filteredActivities.length / pageSize)
                ? "text-gray-500"
                : "text-black hover:underline underline-offset-2"
            } transition-all`}
          >
            NEXT
          </button>
        </div>
      )}
    </section>
  );
};

export default LocalActivitiesComponent;
