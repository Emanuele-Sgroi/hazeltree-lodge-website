/**
 * @file TestimonialSection.js
 * @description Renders the testimonial section of the homepage, showcasing guest reviews in a carousel format. Allows users to view additional reviews in a modal when the "View More Reviews" button is clicked.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useEffect, useState } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import { ImQuotesRight } from "react-icons/im";
import { GoStarFill } from "react-icons/go";
import Modal from "react-modal";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

/**
 * TestimonialSection Component
 *
 * Displays guest reviews in a grid layout and includes a modal for viewing additional reviews.
 * Adjusts the number of displayed reviews based on screen size.
 *
 * @returns {JSX.Element} The rendered TestimonialSection component.
 */
const TestimonialSection = () => {
  const { homepage } = useSiteContent();
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if `#__next` is available in the DOM before setting it
    if (typeof window !== "undefined") {
      const appElement = document.getElementById("__next");
      if (appElement) {
        Modal.setAppElement(appElement);
      }
    }
  }, []);

  // Update displayed reviews based on screen size
  useEffect(() => {
    const updateDisplayedReviews = () => {
      if (window.innerWidth < 600) {
        setDisplayedReviews(homepage.testimonialSectionReviews?.slice(0, 2));
      } else {
        setDisplayedReviews(homepage.testimonialSectionReviews?.slice(0, 3));
      }
    };

    // Initialize reviews display and add resize event listener
    updateDisplayedReviews();
    window.addEventListener("resize", updateDisplayedReviews);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", updateDisplayedReviews);
  }, [homepage.testimonialSectionReviews]);

  // Modal control functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section className="bg-tertiary w-full flex flex-col items-center justify-center py-12 md:py-16 lg:py-20 px-6">
      <div className="flex flex-col justify-center items-center gap-2 max-w-[700px] z-50">
        <div className="flex justify-center items-center gap-3">
          <span className="line-h6-white"></span>
          <h6 className="text-center text-white">
            {homepage.testimonialSectionSmallTitle.toUpperCase()}
          </h6>
          <span className="line-h6-white"></span>
        </div>
        <h2 className="text-center text-white">
          {homepage.testimonialSectionMainTitle}
        </h2>
      </div>

      <div className="grid place-content-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-4 pt-12 md:pt-20 lg:pt-24">
        {displayedReviews?.map((review, index) => (
          <div
            key={index}
            className="flex max-w-full lg:max-w-[520px] max-lg:last:col-span-2 max-md:col-span-2"
          >
            <div className="group/item bg-primary hover:bg-[#367a35] relative size-full p-6 flex flex-col justify-between items-start rounded-xl transition-all duration-300">
              <div className="mb-5">
                <ImQuotesRight className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 text-[#2e3778] group-hover/item:text-white transition-all duration-100 ease-in mb-4" />
                <p className="group-hover/item:text-white transition-all duration-100 ease-in">
                  {review.fields.reviewComment}
                </p>
              </div>

              <div>
                <p className="text-xl font-heavy group-hover/item:text-white transition-all duration-100 ease-in">
                  {review.fields.reviewGuestName}
                </p>
                <p className="text-sm font-light text-gray-800 group-hover/item:text-white transition-all duration-100 ease-in">
                  {review.fields.reviewPlatform}
                </p>
              </div>
              <p className="absolute bottom-6 right-6 text-xl font-heavy flex justify-center items-center gap-1 group-hover/item:text-white transition-all duration-100 ease-in">
                {review.fields.reviewRate}{" "}
                <GoStarFill
                  size={30}
                  color="#FFC107"
                  className="group-hover/item:animate-rotate-3d"
                />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Show "View More Reviews" button if there are more than 3 reviews */}
      {homepage.testimonialSectionReviews &&
        homepage.testimonialSectionReviews.length > 3 && (
          <div className="min-w-[30%] pt-8 md:pt-12 lg:pt-16 px-6">
            <button className="btn_secondary" onClick={openModal}>
              <p className="btn_secondary_text mr-4" style={{ color: "#fff" }}>
                VIEW MORE REVIEWS
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
          </div>
        )}

      {/* Modal to display all reviews */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className="modalScrollBar absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary w-[90%] md:w-[600px] h-[80%]  shadow-lg overflow-auto rounded outline-none focus:outline-none border-y-[1rem] border-[transparent] z-[9999]"
        overlayClassName="fixed min-h-svh bg-[#000000bf]  top-0 left-0 bottom-0 right-0 z-[9999]"
      >
        <button
          onClick={closeModal}
          className="absolute -top-1 right-6 font-heavy"
        >
          Close
        </button>
        <div className="bg-primary flex flex-col px-4">
          {homepage.testimonialSectionReviews?.map((review, index) => (
            <div
              key={index}
              className="group/item flex flex-col justify-between items-start gap-6 py-6"
            >
              <div>
                <ImQuotesRight className="mb-1" />
                <p>{review.fields.reviewComment}</p>
              </div>

              <div>
                <p className="text-xl font-heavy">
                  {review.fields.reviewGuestName}
                </p>
                <p className="text-sm font-light text-gray-800">
                  {review.fields.reviewPlatform}
                </p>
                <p className="flex items-start gap-1 mt-2">
                  {review.fields.reviewRate}{" "}
                  <GoStarFill size={30} color="#FFC107" />
                </p>
              </div>
              <div className="w-11/12 h-px bg-[#2e377833] mt-3 group-last/item:hidden" />
            </div>
          ))}
        </div>
      </Modal>
    </section>
  );
};

export default TestimonialSection;
