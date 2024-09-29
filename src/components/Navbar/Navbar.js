/**
 * @file Navbar.js
 * @description Renders the navigation bar with a logo, menu toggle, and a "book now" button. The navbar becomes visible when scrolling past a certain point unless alwaysVisible is set to true. It also contains logic for handling a side menu on smaller screens.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSiteContent } from "@/context/SiteContentContext";
import { ButtonPrimary, SideMenu } from "@/components";
import images from "@/utils/imageImports";
import { usePathname } from "next/navigation";
import { getAssetUrl } from "@/utils/imageUtils";

/**
 * Navbar Component
 *
 * Renders the site's main navigation bar. It becomes visible after scrolling a certain distance or can be set to always visible using the `alwaysVisible` prop.
 * It includes a logo, a menu button that toggles the side menu on smaller screens, and a "book now" button on all pages except the booking page.
 *
 * @param {boolean} alwaysVisible - Controls if the navbar should always be visible, regardless of scroll position.
 * @returns {JSX.Element} The rendered Navbar component.
 */
const Navbar = ({ alwaysVisible = false }) => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(alwaysVisible);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const { general } = useSiteContent();
  const shouldShowButton = !pathname.startsWith("/booking");

  const navLogoUrl =
    general && general.navbarLogo ? getAssetUrl(general.navbarLogo) : "";

  // Handle scroll and resize events to control navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      if (!isMenuOpen && !alwaysVisible && windowWidth >= 768) {
        setIsVisible(window.scrollY > 600);
      }
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen, alwaysVisible, windowWidth]);

  // Toggle the visibility of the menu
  const toggleMenu = () => {
    if (isMenuOpen && window.scrollY === 0 && !alwaysVisible) {
      setIsVisible(false);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  // Determine if the navbar should be visible based on the screen width and scroll position
  const shouldBeVisible = windowWidth < 768 || isVisible;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full bg-primary shadow-md transform transition-transform duration-500 z-[9999] ${
          shouldBeVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div
          className={`size-full flex justify-between items-center px-8 lg:px-12 py-3 md:py-5 lg:py-6 min-h-[92px]`}
        >
          {/* Menu Toggle Button */}
          <div>
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={toggleMenu}
            >
              <div className="w-8 h-2 relative flex flex-col justify-between items-center">
                <span
                  className={`w-full h-[2px] bg-accent-green transform transition-transform duration-300 ${
                    isMenuOpen ? "translate-y-[3px] rotate-[45deg]" : ""
                  }`}
                ></span>
                <span
                  className={`w-full h-[2px] bg-accent-green transition-transform duration-300 ${
                    isMenuOpen ? "translate-y-[-3px] rotate-[-45deg]" : ""
                  }`}
                ></span>
              </div>
              <p
                className={`max-sm:hidden text-lg font-heavy mt-1 text-accent-green`}
              >
                MENU
              </p>
            </button>
          </div>

          {/* Logo - Centered */}
          <Link
            href="/"
            className={`max-sm:hidden absolute left-1/2 transform -translate-x-1/2`}
          >
            <Image
              src={navLogoUrl || images.hazeltree_lodge_logo_variation_black}
              alt="Hazeltree Lodge"
              width={135}
              height={0}
              className={`w-auto h-[50px] sm:h-[55px] md:h-[65px] lg:h-[75px]`}
            />
          </Link>

          {/* Book Now Button */}
          {shouldShowButton && (
            <ButtonPrimary text="book now" isBeige={false} href="/booking" />
          )}
        </div>
      </nav>

      {/* Side Menu Component */}
      <SideMenu isMenuOpen={isMenuOpen} onClick={toggleMenu} />
    </>
  );
};

export default Navbar;
