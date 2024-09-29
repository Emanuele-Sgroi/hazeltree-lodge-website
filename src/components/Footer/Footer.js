/**
 * @file Footer.js
 * @description Footer component for the website. Displays the footer with logo, contact details, links, and social media links. It also includes a "Back to Top" button with smooth scroll functionality.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import styles from "../../styles/OtherStyles.module.scss";
import Image from "next/image";
import { FaFacebook } from "react-icons/fa";
import { useSiteContent } from "@/context/SiteContentContext";
import { getAssetUrl } from "@/utils/imageUtils";
import Link from "next/link";
import { RiArrowUpWideLine } from "react-icons/ri";

const Footer = () => {
  const { general } = useSiteContent();

  // Get the URL for the footer logo image
  const footerLogoUrl =
    general && general.footerLogo ? getAssetUrl(general.footerLogo) : "";

  const date = new Date();
  const year = date.getFullYear();

  /**
   * @function formatPhoneNumber
   * @description Format the phone number to include spaces for better readability.
   * @param {string} phoneNumber - The phone number to format.
   * @returns {string} Formatted phone number.
   */
  const formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/(\d{2,3})(\d{3})(\d{4})/, "$1 $2 $3");
  };

  /**
   * @function scrollToTop
   * @description Smooth scroll to the top of the page when the "Back to Top" button is clicked.
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className={`${styles.footer} w-full flex flex-col justify-center items-center bg-footer-dark text-white`}
      style={{ marginTop: "auto" }}
    >
      {/* Back to Top Button */}
      <div
        className={`pt-4 pb-6 w-[80%] border-b border-solid flex justify-center ${
          general && general.footerColour ? "border-black" : "border-gray-400"
        }`}
      >
        <button
          className="flex flex-col justify-center items-center text-[12px]"
          onClick={scrollToTop}
        >
          <RiArrowUpWideLine size={25} />
          BACK TO TOP
        </button>
      </div>

      {/* Main Footer Content */}
      <div
        className={`w-full max-w-[80%] flex justify-around items-start py-12 px-4 gap-12 flex-wrap`}
      >
        {/* Footer Logo */}
        <Link href={"/"}>
          <Image
            src={footerLogoUrl}
            alt="Hazeltree Lodge"
            width={270}
            height={0}
            className="max-w-full h-auto"
          />
        </Link>

        {/* Links and Contact Information */}
        <div className="flex flex-grow justify-around gap-12 flex-wrap">
          {/* First Column: Main Links */}
          <div className={`flex gap-12 flex-wrap`}>
            <ul className="flex flex-col gap-4">
              {[
                { name: "Book Now", href: "/booking" },
                { name: "About", href: "/about" },
                { name: "Rooms", href: "/rooms" },
                { name: "Things to do", href: "/things-to-do" },
                { name: "Breakfast Menu", href: "/breakfast-menu" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    target={link.href === "/breakfast-menu" ? "_blank" : ""}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-4">
              {[
                { name: "Contact", href: "/contact" },
                { name: "FAQs", href: "/faqs" },
                { name: "Terms & Conditions", href: "/terms-and-conditions" },
                { name: "Privacy Policy", href: "/privacy-policy" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Second Column: Contact Info and Social Links */}
          <div className={`flex gap-12 flex-wrap`}>
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href={`tel:${general.phonePrefix}${general.phoneNumber}`}
                  target="_blank"
                >
                  {general.phonePrefix}&nbsp;
                  {formatPhoneNumber(general.phoneNumber)}
                </Link>
              </li>
              <li>
                <Link href={`mailto:${general.emailAddress}`} target="_blank">
                  {general.emailAddress}
                </Link>
              </li>
              <li>
                <Link
                  href={general.facebookLink}
                  target="_blank"
                  className={`flex gap-3 items-center justify-start mt-4`}
                >
                  Follow us
                  <FaFacebook
                    color={`${
                      general && general.footerColour ? "#2e3778" : "white"
                    }`}
                    size={25}
                  />
                </Link>
              </li>
            </ul>

            {/* Address */}
            <Link
              href={general.addressMapLink}
              target="_blank"
              className={`flex flex-col text-left gap-1`}
            >
              {general.address.split("\n").map((line, index) => (
                <span key={index}>{line}</span>
              ))}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="w-full bg-primary py-4 px-8 text-center flex flex-col md:flex-row justify-between items-center gap-3 text-black">
        <p>© {year} Hazeltree Lodge. All rights reserved.</p>
        <p className="flex gap-1">
          Developed by
          <span className="text-heavy text-black font-heavy hover:underline">
            <Link href={general.linkDeveloper} target="_blank">
              {general.nameDeveloper}
            </Link>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
