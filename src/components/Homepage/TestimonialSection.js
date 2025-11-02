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
      <div className="flex flex-col justify-center items-center gap-3 max-w-[700px] mb-12 md:mb-16">
        <div className="flex justify-center items-center gap-3">
          <span className="line-h6"></span>
          <h6>{homepage.testimonialSectionSmallTitle.toUpperCase()}</h6>
          <span className="line-h6"></span>
        </div>
        <h2>{homepage.testimonialSectionMainTitle}</h2>
        {homepage.testimonialSectionParagraph && (
          <>
            <div className="w-20 h-[2px] bg-border mt-2"></div>
            <p className="text-center text-base md:text-lg mt-2">
              {homepage?.testimonialSectionParagraph}
            </p>
          </>
        )}
      </div>

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
              VIEW ALL REVIEWS
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
