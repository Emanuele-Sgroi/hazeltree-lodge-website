/**
 * @file ContactLocationSection.js
 * @description Displays the location section on the contact page, including a title, subtitle, and embedded Google Maps for the business location.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";

/**
 * ContactLocationSection Component
 * Renders the title, subtitle, and an embedded Google Maps iframe to show the business location.
 *
 * @param {string} smallTitle - The small title displayed above the main title.
 * @param {string} mainTitle - The main title for the location section.
 * @param {string} map - The URL of the Google Maps embed link.
 */
const ContactLocationSection = ({ smallTitle, mainTitle, map }) => {
  return (
    <section className="w-full bg-secondary py-12 md:py-16 lg:py-20 flex flex-col items-center">
      {/* Title and Subtitle */}
      <div className="flex flex-col justify-center items-center gap-2 max-w-[770px] px-4">
        <div className="flex justify-center items-center gap-3">
          <span className="line-h6"></span>
          <h6 className="text-center">{smallTitle?.toUpperCase()}</h6>
          <span className="line-h6"></span>
        </div>
        <h2 className="text-center">{mainTitle}</h2>
      </div>

      {/* Google Maps Embed */}
      <div className="w-full flex justify-center pt-12 md:pt-20 px-6 md:px-12 lg:px-24">
        <iframe
          src={`${map}`}
          width="600"
          height="450"
          style={{ border: "0px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-[400px] md:h-[550px] xl:h-[740px] focus:outline-none active:outline-none focus:border-none active:border-none"
        ></iframe>
      </div>
    </section>
  );
};

export default ContactLocationSection;
