/**
 * @file SideMenu.js
 * @description This component renders a side menu that appears when the user clicks the hamburger icon in the navbar. The menu slides in from the side and includes navigation links, contact information, and social media links.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSiteContent } from "@/context/SiteContentContext";
import { FaFacebook } from "react-icons/fa";
import styles from "./SideMenu.module.scss";

/**
 * SideMenu Component
 *
 * Renders the side menu that slides in from the left when the hamburger icon in the navbar is clicked.
 * The menu includes navigation links, contact information, and social media links.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isMenuOpen - Whether the menu is currently open.
 * @param {Function} props.onClick - Function to handle closing the menu.
 * @returns {JSX.Element} The rendered side menu component.
 */
const SideMenu = ({ isMenuOpen, onClick }) => {
  const { general } = useSiteContent(); // Get general site content from the context
  const [visible, setVisible] = useState(false); // Control the visibility of the side menu

  // Toggle the body scroll and menu visibility when the menu state changes
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling when menu is open
      setVisible(true);
    } else {
      setVisible(false);
      document.body.style.overflow = "auto"; // Re-enable scrolling when menu is closed
    }
  }, [isMenuOpen]);

  return (
    <>
      {/* Overlay with fade-in effect */}
      <div
        className={`fixed top-0 left-0 w-full h-full transition-opacity duration-700 z-40 bg-black backdrop-blur-3xl ${
          visible ? "opacity-60" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClick}
      />

      {/* Side menu with slide-in effect */}
      <div
        className={`${
          styles.sideMenu
        } h-svh min-h-svh fixed bottom-0 left-0 min-w-full sm:min-w-[500px] bg-side-menu z-40 transform transition-transform duration-700 overflow-auto ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className={`flex flex-col py-16 sm:py-10 pl-16 pr-8 sm:pr-20`}>
          <div className={`h-[40px] sm:h-[90px]`} />

          {/* Main navigation links */}
          <ul className="flex flex-col gap-3">
            {[
              { href: "/", text: "Home" },
              { href: "/about", text: "About" },
              { href: "/rooms", text: "Rooms" },
              { href: "/things-to-do", text: "Things to do" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={` flex items-center justify-start gap-2 w-fit`}
                  onClick={onClick}
                >
                  <span className="h-px w-4 bg-black"></span>
                  <p className="text-4xl font-light transition-all ease-in-out transform hover:translate-x-2">
                    {link.text}
                  </p>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/booking"
                className={` flex items-center justify-start gap-2`}
                onClick={onClick}
              >
                <span className="h-px w-4 bg-black"></span>
                <p className="text-4xl font-heavy transition-all ease-in-out transform hover:translate-x-2">
                  BOOK NOW
                </p>
              </Link>
            </li>
          </ul>

          {/* Divider line */}
          <div className="h-px w-1/2 bg-black my-6 max-sm:min-w-[80%]" />

          {/* Secondary navigation links */}
          <ul className="flex flex-col">
            {[
              { href: "/contact", text: "Contact" },
              { href: "/faqs", text: "FAQs" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={onClick}>
                  <p className="text-[18px] md:text-3xl font-light transition-all ease-in-out hover:underline hover:underline-offset-4">
                    {link.text}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* Contact information */}
          <ul className="flex flex-col my-5">
            <li>
              <Link
                href={`tel:${general.phonePrefix}${general.phoneNumber}`}
                target="_blank"
                className={`flex gap-3`}
              >
                <p className="text-[18px] md:text-2xl font-light">
                  {general.phonePrefix}
                </p>
                <p className="text-[18px] md:text-2xl font-light">
                  {general.phoneNumber}
                </p>
              </Link>
            </li>
            <li>
              <Link href={`mailto:${general.emailAddress}`} target="_blank">
                <p className="text-[18px] md:text-2xl font-light">
                  {general.emailAddress}
                </p>
              </Link>
            </li>
          </ul>

          {/* Address */}
          <Link
            href={general.addressMapLink}
            target="_blank"
            className={` flex flex-col`}
          >
            {general.address.split("\n").map((line, index) => (
              <p key={index} className="text-[18px] md:text-2xl font-light">
                {line}
              </p>
            ))}
          </Link>

          {/* Divider line */}
          <div className="h-px w-1/2 bg-black my-7" />

          {/* Social media link */}
          <Link
            href={general.facebookLink}
            target="_blank"
            className="flex gap-3 items-center justify-start"
          >
            <p className="text-[18px] md:text-xl font-light">Follow us</p>
            <FaFacebook color="#2e3778" size={25} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
