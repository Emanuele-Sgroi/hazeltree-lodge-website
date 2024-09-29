/**
 * @file not-found.js
 * @description Custom 404 page for the website.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import Link from "next/link";
import { Navbar } from "@/components";

/**
 * NotFound Component
 *
 * Renders a custom 404 page when a user navigates to a non-existent route.
 * Includes a navigation bar and a link to return to the homepage.
 *
 * @returns {JSX.Element} The NotFound component.
 */
export default function NotFound() {
  return (
    <div className="relative min-h-[80dvh] px-8 pb-8 pt-[80px] flex flex-col justify-center items-center">
      {/* Navigation bar is always visible on the 404 page */}
      <Navbar alwaysVisible={true} />

      {/* Error message indicating the page was not found */}
      <h3 className="uppercase text-center">
        Oops! We could not find what you were looking for.
      </h3>

      {/* Large 404 indicator */}
      <h3 className="text-9xl text-[#367a35] text-center">404</h3>

      {/* Additional message for the user */}
      <p className="mb-6 text-center">
        The content you are trying to find does not exist.
      </p>

      {/* Link to return to the homepage */}
      <Link
        href="/"
        className="py-2 px-3 rounded-lg bg-dark-blue text-white text-center"
      >
        Return Home
      </Link>
    </div>
  );
}
