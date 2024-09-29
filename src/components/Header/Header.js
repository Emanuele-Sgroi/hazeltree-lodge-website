/**
 * @file Header.js
 * @description Header component that appears at the top of each page. Displays the logo, contact information, and navigation links. The navbar is displayed on scrolling, and social icons are included.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSiteContent } from "@/context/SiteContentContext";
import { getAssetUrl } from "@/utils/imageUtils";
import { usePathname } from "next/navigation";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
} from "react-icons/fa";

const Header = () => {
  const { general } = useSiteContent();
  const pathname = usePathname();

  // Get the URL for the main logo image
  const mainLogoUrl =
    general && general.mainLogo ? getAssetUrl(general.mainLogo) : "";

  /**
   * @function getLinkClass
   * @description Determines the active link style for navigation.
   * @param {string} path - The path to compare with the current route.
   * @returns {string} The appropriate class name for the link.
   */
  const getLinkClass = (path) => {
    return pathname === path ? "header-link-active" : "header-link";
  };

  /**
   * @function formatPhoneNumber
   * @description Formats the phone number for better readability.
   * @param {string} phoneNumber - The phone number to format.
   * @returns {string} Formatted phone number.
   */
  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/(\d{2,3})(\d{3})(\d{4})/, "$1 $2 $3");
  };

  // Format the address for display, replacing new lines with commas
  //This function assumes that the address is written in multiple lines like the example below:
  //address 1
  //address 2
  //and so on...
  const formatAddress = (address) => {
    return address.replace(/\n/g, ", ").replace(/,\s*$/, "");
  };

  return (
    <header className="relative max-md:hidden w-full bg-white z-50">
      {/* Top part: Contact information and social link */}
      <div className="relative w-full bg-[#1c1c1f] text-white flex justify-center gap-4 lg:gap-8 py-1 z-50">
        <Link
          href={`tel:${general.phonePrefix}${general.phoneNumber}`}
          target="_blank"
          className="flex items-center gap-1 lg:gap-2"
        >
          <FaPhoneAlt className="max-lg:w-[12px] max-lg:h-[12px]" />
          <p className="text-s font-light">
            {general.phonePrefix}&nbsp;&nbsp;
            {formatPhoneNumber(general.phoneNumber)}
          </p>
        </Link>
        <Link
          href={`mailto:${general.emailAddress}`}
          target="_blank"
          className="flex items-center gap-1 lg:gap-2"
        >
          <FaEnvelope className="max-lg:w-[12px] max-lg:h-[12px]" />
          <p className="text-s font-light">{general.emailAddress}</p>
        </Link>
        <Link
          href={general.addressMapLink}
          target="_blank"
          className="flex items-center gap-1 lg:gap-2"
        >
          <FaMapMarkerAlt className="max-lg:w-[12px] max-lg:h-[12px]" />
          <p className="text-s font-light">{formatAddress(general.address)}</p>
        </Link>
        <Link
          href={general.facebookLink}
          target="_blank"
          className="absolute right-3 lg:right-10 top-1/2 transform -translate-y-1/2"
        >
          <FaFacebook className="header-social-icon" />
        </Link>
      </div>

      {/* Bottom part: Logo and navigation links */}
      <div className="relative w-full flex flex-col items-center justify-center px-4 pt-3 pb-[7px] gap-[10px] z-50">
        {mainLogoUrl && (
          <Link href="/">
            <Image
              src={mainLogoUrl}
              alt="Hazeltree Lodge"
              width={215}
              height={0}
              className="w-[175px] xl:w-[250px] h-auto z-50"
            />
          </Link>
        )}
        <div className="flex justify-center items-center gap-2 md:gap-4 lg:gap-6">
          <Link className={getLinkClass("/")} href="/">
            HOME
          </Link>
          <span className="header-separator"></span>
          <Link className={getLinkClass("/about")} href="/about">
            ABOUT
          </Link>
          <span className="header-separator"></span>
          <Link className={getLinkClass("/rooms")} href="/rooms">
            ROOMS
          </Link>
          <span className="header-separator"></span>
          <Link className={getLinkClass("/things-to-do")} href="/things-to-do">
            THINGS TO DO
          </Link>
          <span className="header-separator"></span>
          <Link className={getLinkClass("/contact")} href="/contact">
            CONTACT
          </Link>
          <span className="header-separator"></span>
          <Link className={getLinkClass("/faqs")} href="/faqs">
            FAQS
          </Link>
          <span className="header-separator"></span>
          <Link className={getLinkClass("/booking")} href="/booking">
            BOOK NOW
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
