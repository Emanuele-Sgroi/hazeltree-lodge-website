// /**
//  * @file TestimonialSection.js
//  * @description Renders the testimonial section of the homepage, showcasing guest reviews in a carousel format. Allows users to view additional reviews in a modal when the "View More Reviews" button is clicked.
//  * @author
//  * Emanuele Sgroi
//  * @date 20 August 2024
//  */

// "use client";

// import React, { useEffect, useState } from "react";
// import { useSiteContent } from "@/context/SiteContentContext";
// import { ImQuotesRight } from "react-icons/im";
// import { GoStarFill } from "react-icons/go";
// import Modal from "react-modal";
// import { LiaLongArrowAltRightSolid } from "react-icons/lia";

// /**
//  * TestimonialSection Component
//  *
//  * Displays guest reviews in a grid layout and includes a modal for viewing additional reviews.
//  * Adjusts the number of displayed reviews based on screen size.
//  *
//  * @returns {JSX.Element} The rendered TestimonialSection component.
//  */
// const TestimonialSection = () => {
//   const { homepage } = useSiteContent();
//   const [displayedReviews, setDisplayedReviews] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     // Check if `#__next` is available in the DOM before setting it
//     if (typeof window !== "undefined") {
//       const appElement = document.getElementById("__next");
//       if (appElement) {
//         Modal.setAppElement(appElement);
//       }
//     }
//   }, []);

//   // Update displayed reviews based on screen size
//   useEffect(() => {
//     const updateDisplayedReviews = () => {
//       if (window.innerWidth < 600) {
//         setDisplayedReviews(homepage.testimonialSectionReviews?.slice(0, 2));
//       } else {
//         setDisplayedReviews(homepage.testimonialSectionReviews?.slice(0, 3));
//       }
//     };

//     // Initialize reviews display and add resize event listener
//     updateDisplayedReviews();
//     window.addEventListener("resize", updateDisplayedReviews);

//     // Cleanup event listener on component unmount
//     return () => window.removeEventListener("resize", updateDisplayedReviews);
//   }, [homepage.testimonialSectionReviews]);

//   // Modal control functions
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   return (
//     <section className="bg-tertiary w-full flex flex-col items-center justify-center py-12 md:py-16 lg:py-20 px-6">
//       <div className="flex flex-col justify-center items-center gap-2 max-w-[700px] z-50">
//         <div className="flex justify-center items-center gap-3">
//           <span className="line-h6-white"></span>
//           <h6 className="text-center text-white">
//             {homepage.testimonialSectionSmallTitle.toUpperCase()}
//           </h6>
//           <span className="line-h6-white"></span>
//         </div>
//         <h2 className="text-center text-white">
//           {homepage.testimonialSectionMainTitle}
//         </h2>
//       </div>

//       <div className="grid place-content-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-4 pt-12 md:pt-20 lg:pt-24">
//         {displayedReviews?.map((review, index) => (
//           <div
//             key={index}
//             className="flex max-w-full lg:max-w-[520px] max-lg:last:col-span-2 max-md:col-span-2"
//           >
//             <div className="group/item bg-primary hover:bg-[#367a35] relative size-full p-6 flex flex-col justify-between items-start rounded-xl transition-all duration-300">
//               <div className="mb-5">
//                 <ImQuotesRight className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 text-[#2e3778] group-hover/item:text-white transition-all duration-100 ease-in mb-4" />
//                 <p className="group-hover/item:text-white transition-all duration-100 ease-in">
//                   {review.fields.reviewComment}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-xl font-heavy group-hover/item:text-white transition-all duration-100 ease-in">
//                   {review.fields.reviewGuestName}
//                 </p>
//                 <p className="text-sm font-light text-gray-800 group-hover/item:text-white transition-all duration-100 ease-in">
//                   {review.fields.reviewPlatform}
//                 </p>
//               </div>
//               <p className="absolute bottom-6 right-6 text-xl font-heavy flex justify-center items-center gap-1 group-hover/item:text-white transition-all duration-100 ease-in">
//                 {review.fields.reviewRate}{" "}
//                 <GoStarFill
//                   size={30}
//                   color="#FFC107"
//                   className="group-hover/item:animate-rotate-3d"
//                 />
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Show "View More Reviews" button if there are more than 3 reviews */}
//       {homepage.testimonialSectionReviews &&
//         homepage.testimonialSectionReviews.length > 3 && (
//           <div className="min-w-[30%] pt-8 md:pt-12 lg:pt-16 px-6">
//             <button className="btn_secondary" onClick={openModal}>
//               <p className="btn_secondary_text mr-4" style={{ color: "#fff" }}>
//                 VIEW MORE REVIEWS
//               </p>
//               <LiaLongArrowAltRightSolid
//                 color="#fff"
//                 className="btn_secondary_arrow"
//               />
//               <span
//                 className="btn_secondary_solid"
//                 style={{ background: "#fff" }}
//               />
//             </button>
//           </div>
//         )}

//       {/* Modal to display all reviews */}
//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={closeModal}
//         ariaHideApp={false}
//         className="modalScrollBar absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary w-[90%] md:w-[600px] h-[80%]  shadow-lg overflow-auto rounded outline-none focus:outline-none border-y-[1rem] border-[transparent] z-[9999]"
//         overlayClassName="fixed min-h-svh bg-[#000000bf]  top-0 left-0 bottom-0 right-0 z-[9999]"
//       >
//         <button
//           onClick={closeModal}
//           className="absolute -top-1 right-6 font-heavy"
//         >
//           Close
//         </button>
//         <div className="bg-primary flex flex-col px-4">
//           {homepage.testimonialSectionReviews?.map((review, index) => (
//             <div
//               key={index}
//               className="group/item flex flex-col justify-between items-start gap-6 py-6"
//             >
//               <div>
//                 <ImQuotesRight className="mb-1" />
//                 <p>{review.fields.reviewComment}</p>
//               </div>

//               <div>
//                 <p className="text-xl font-heavy">
//                   {review.fields.reviewGuestName}
//                 </p>
//                 <p className="text-sm font-light text-gray-800">
//                   {review.fields.reviewPlatform}
//                 </p>
//                 <p className="flex items-start gap-1 mt-2">
//                   {review.fields.reviewRate}{" "}
//                   <GoStarFill size={30} color="#FFC107" />
//                 </p>
//               </div>
//               <div className="w-11/12 h-px bg-[#2e377833] mt-3 group-last/item:hidden" />
//             </div>
//           ))}
//         </div>
//       </Modal>
//     </section>
//   );
// };

// export default TestimonialSection;

/**
 * @file TestimonialSection.js
 * @description Renders the testimonial section of the homepage with elegant traditional B&B design, showcasing guest reviews in a grid format. Allows users to view additional reviews in a modal.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 * @updated November 2025 - Redesigned with traditional Irish B&B aesthetic
 */

"use client";

import React, { useEffect, useState } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import Modal from "react-modal";

/**
 * TestimonialSection Component
 *
 * Displays guest reviews in an elegant grid layout with full star ratings.
 * Includes a modal for viewing all reviews with smooth animations.
 *
 * @returns {JSX.Element} The rendered TestimonialSection component.
 */
const TestimonialSection = () => {
  const { homepage } = useSiteContent();
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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
      if (window.innerWidth < 768) {
        setDisplayedReviews(homepage.testimonialSectionReviews?.slice(0, 3));
      } else {
        setDisplayedReviews(homepage.testimonialSectionReviews?.slice(0, 6));
      }
    };

    updateDisplayedReviews();
    window.addEventListener("resize", updateDisplayedReviews);

    return () => window.removeEventListener("resize", updateDisplayedReviews);
  }, [homepage.testimonialSectionReviews]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullRating = Math.round(rating);

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-xl ${
            i <= fullRating ? "text-[#d4af37]" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section className="bg-white w-full flex flex-col items-center justify-center py-16 md:py-20 lg:py-24 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-3 max-w-[700px] mb-8">
        <div className="flex justify-center items-center gap-3">
          <span className="line-h6"></span>
          <h6>{homepage.testimonialSectionSmallTitle.toUpperCase()}</h6>
          <span className="line-h6"></span>
        </div>
        <h2 className="text-center">{homepage.testimonialSectionMainTitle}</h2>
        {homepage.testimonialSectionParagraph && (
          <>
            <div className="w-20 h-[2px] bg-border mt-2"></div>
            <p className="text-center text-base md:text-lg mt-2">
              {homepage?.testimonialSectionParagraph}
            </p>
          </>
        )}
      </div>

      {/* Review Statistics Banner */}
      {homepage.testimonialStatistic &&
        (homepage.testimonialStatistic.bookingCom?.visible ||
          homepage.testimonialStatistic.google?.visible ||
          homepage.testimonialStatistic.tripAdvisor?.visible) && (
          <div className="md:border md:border-border md:p-6 mb-12">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 min-[1033px]:gap-10">
              {/* Booking.com */}
              {homepage.testimonialStatistic.bookingCom?.visible && (
                <a
                  href={homepage.testimonialStatistic.bookingCom.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:opacity-75 transition-opacity group"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <rect width="24" height="24" rx="4" fill="#003580" />
                      <text
                        x="12"
                        y="17"
                        textAnchor="middle"
                        fill="white"
                        fontSize="14"
                        fontWeight="bold"
                      >
                        B
                      </text>
                    </svg>
                    <span className="hidden lg:flex font-semibold text-dark-blue group-hover:text-[#003580]">
                      Booking.com
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-accent-green">
                      {homepage.testimonialStatistic.bookingCom.score}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({homepage.testimonialStatistic.bookingCom.reviews}{" "}
                      reviews)
                    </span>
                  </div>
                </a>
              )}

              {/* Google */}
              {homepage.testimonialStatistic.google?.visible && (
                <a
                  href={homepage.testimonialStatistic.google.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:opacity-75 transition-opacity group"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-8 h-8" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="hidden lg:flex font-semibold text-dark-blue group-hover:text-[#4285F4]">
                      Google
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-accent-green">
                      {homepage.testimonialStatistic.google.score}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({homepage.testimonialStatistic.google.reviews} reviews)
                    </span>
                  </div>
                </a>
              )}

              {/* TripAdvisor */}
              {homepage.testimonialStatistic.tripAdvisor?.visible && (
                <a
                  href={homepage.testimonialStatistic.tripAdvisor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:opacity-75 transition-opacity group"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      stroke-linejoin="round"
                      stroke-miterlimit="2"
                    >
                      <path
                        d="M175.335 281.334c0 24.483-19.853 44.336-44.336 44.336-24.484 0-44.337-19.853-44.337-44.336 0-24.484 19.853-44.337 44.337-44.337 24.483 0 44.336 19.853 44.336 44.337zm205.554-44.337c-24.48 0-44.336 19.853-44.336 44.337 0 24.483 19.855 44.336 44.336 44.336 24.481 0 44.334-19.853 44.334-44.336-.006-24.47-19.839-44.31-44.309-44.323l-.025-.01v-.004zm125.002 44.337c0 68.997-55.985 124.933-124.999 124.933a124.466 124.466 0 01-84.883-33.252l-40.006 43.527-40.025-43.576a124.45 124.45 0 01-84.908 33.3c-68.968 0-124.933-55.937-124.933-124.932A124.586 124.586 0 0146.889 189L6 144.517h90.839c96.116-65.411 222.447-65.411 318.557 0H506l-40.878 44.484a124.574 124.574 0 0140.769 92.333zm-290.31 0c0-46.695-37.858-84.55-84.55-84.55-46.691 0-84.55 37.858-84.55 84.55 0 46.691 37.859 84.55 84.55 84.55 46.692 0 84.545-37.845 84.55-84.54v-.013.003zM349.818 155.1a244.01 244.01 0 00-187.666 0C215.532 175.533 256 223.254 256 278.893c0-55.634 40.463-103.362 93.826-123.786l-.005-.006h-.003zm115.64 126.224c0-46.694-37.858-84.55-84.55-84.55-46.691 0-84.552 37.859-84.552 84.55 0 46.692 37.855 84.55 84.553 84.55 46.697 0 84.55-37.858 84.55-84.55z"
                        fill="#002b11"
                        fill-rule="nonzero"
                      />
                    </svg>

                    <span className="hidden lg:flex font-semibold text-dark-blue group-hover:text-[#00AA6C]">
                      TripAdvisor
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-accent-green">
                      {homepage.testimonialStatistic.tripAdvisor.score}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({homepage.testimonialStatistic.tripAdvisor.reviews}{" "}
                      reviews)
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

      {/* Reviews Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12">
        {displayedReviews?.map((review, index) => (
          <div
            key={index}
            className="group bg-secondary border border-[#e8e4de] rounded-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Quote Icon */}
            <div className="text-4xl text-accent-green  mb-4 leading-none">
              &quot;
            </div>

            {/* Review Text */}
            <p className="text-dark-blue text-base leading-relaxed mb-6 italic">
              {review.fields.reviewComment}
            </p>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {renderStars(review.fields.reviewRate)}
            </div>

            {/* Author Info */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-accent-green font-semibold text-lg">
                  {review.fields.reviewGuestName}
                </p>
                <p className="text-accent-brown text-sm italic">
                  {review.fields.reviewPlatform}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      {homepage.testimonialSectionReviews &&
        homepage.testimonialSectionReviews.length > 6 && (
          <div className="mt-6">
            <button
              onClick={openModal}
              className="bg-accent-green text-white border-2 border-accent-green px-12 py-3 rounded text-base tracking-wide transition-all duration-300 hover:bg-transparent hover:text-accent-green font-medium"
            >
              VIEW MORE REVIEWS
            </button>
          </div>
        )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className="bg-white w-[95%] md:w-[90%] lg:w-[1000px] max-w-[1000px] max-h-[85vh] shadow-2xl overflow-hidden rounded-lg outline-none focus:outline-none mx-auto my-8 [99999]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 z-[99998] flex items-center justify-center p-4 overflow-y-auto"
        closeTimeoutMS={300}
      >
        {/* Modal Header */}
        <div className="bg-white border-b-2 border-border px-6 md:px-8 py-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-dark-blue text-2xl md:text-3xl font-normal">
              All Guest Reviews
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-accent-green text-4xl leading-none transition-colors duration-200 font-light"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(85vh-88px)] px-6 md:px-8 py-6">
          <div className="grid grid-cols-1 gap-6">
            {homepage.testimonialSectionReviews?.map((review, index) => (
              <div
                key={index}
                className="bg-secondary border border-border rounded-lg p-6 md:p-8"
              >
                {/* Quote Icon */}
                <div className="text-4xl text-accent-green mb-4 leading-none">
                  &quot;
                </div>

                {/* Review Text */}
                <p className="text-dark-blue text-base leading-relaxed mb-6 italic">
                  {review.fields.reviewComment}
                </p>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {renderStars(review.fields.reviewRate)}
                </div>

                {/* Author Info */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-accent-green font-semibold text-lg">
                      {review.fields.reviewGuestName}
                    </p>
                    <p className="text-accent-brown text-sm italic">
                      {review.fields.reviewPlatform}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Custom Modal Animations */}
      <style jsx global>{`
        .ReactModal__Overlay {
          opacity: 0;
          transition: opacity 300ms ease-in-out;
        }

        .ReactModal__Overlay--after-open {
          opacity: 1;
        }

        .ReactModal__Overlay--before-close {
          opacity: 0;
        }

        .ReactModal__Content {
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 300ms ease-out, transform 300ms ease-out;
        }

        .ReactModal__Content--after-open {
          opacity: 1;
          transform: scale(1);
        }

        .ReactModal__Content--before-close {
          opacity: 0;
          transform: scale(0.95);
        }
      `}</style>
    </section>
  );
};

export default TestimonialSection;
