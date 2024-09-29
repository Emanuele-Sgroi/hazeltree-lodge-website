/**
 * @file ConfirmationWrapper.js
 * @description This component displays the booking confirmation details, including the booking reference numbers, after a successful checkout. It fetches booking data from sessionStorage and provides the option for users to return to the homepage. It also handles mobile responsiveness and background images for the page.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import { getOptimizedImageUrl } from "@/utils/imageUtils";
import Image from "next/image";
import Link from "next/link";

/**
 * ConfirmationWrapper Component
 * Displays booking details and reference numbers to the user after checkout.
 * Fetches booking data from sessionStorage and handles redirection if data is missing.
 */
const ConfirmationWrapper = () => {
  const { id } = useParams();
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const { general, homepage } = useSiteContent();
  const [isMobile, setIsMobile] = useState(false);

  /**
   * Retrieve booking data from sessionStorage.
   * If no data is found, the user is redirected to the homepage.
   */
  useEffect(() => {
    const storedDataString = sessionStorage.getItem(`checkout_${id}`);
    if (storedDataString) {
      const storedData = JSON.parse(storedDataString);
      setBookingData(storedData);
    } else {
      router.push("/"); // Redirect to home if no booking data is found
    }
  }, [router]);

  /**
   * Handle responsive behavior for mobile devices.
   * Adjust the image based on screen width.
   */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Set background images based on device type (mobile or desktop)
  const images = isMobile
    ? homepage.heroSectionBackgroundImagesMobile[1]
    : homepage.heroSectionBackgroundImages[1];

  /**
   * Handle "Return to Homepage" action.
   * Clears booking data from sessionStorage and redirects to the homepage.
   */
  const handleReturn = () => {
    sessionStorage.removeItem(`checkout_${id}`);
    router.replace("/");
  };

  return (
    <section className=" min-h-svh w-full relative flex justify-center items-center px-4 py-12">
      <div className="relative p-8 bg-primary rounded-sm shadow-md max-w-[550px] z-[2] flex flex-col justify-center items-center text-center">
        {bookingData ? (
          <>
            <h2 className="text-dark-blue mb-8">Thank You for Your Booking!</h2>
            <p className="mb-6">
              You will receive a confirmation email shortly.
            </p>
            {/* Display single or multiple booking reference numbers */}
            {bookingData.bookingIds.length === 1 ? (
              <p className="mb-4">
                <strong>Booking Reference:</strong> {bookingData.bookingIds[0]}
              </p>
            ) : (
              <div className="mb-4">
                <p className="mb-2">
                  <strong>Booking References:</strong>
                </p>
                <ul className="list-disc list-inside mb-2">
                  {bookingData.bookingIds.map((id, index) => (
                    <li key={id}>
                      <strong>Reference {index + 1}:</strong> {id}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600">
                  Each room has its own reference number.
                </p>
              </div>
            )}

            <p className="mb-6">
              If you encounter any issues, please feel free to{" "}
              <Link
                href="/contact"
                className="text-accent-green underline underline-offset-4"
              >
                contact us
              </Link>
              .
            </p>
            <p className="font-heavy mb-6">
              Your stay is confirmed, and we can&apos;t wait to see you!
            </p>
            <button
              className="py-2 px-4 rounded-md bg-dark-blue text-white transform active:scale-95 disabled:active:scale-100 disabled:opacity-50"
              onClick={handleReturn}
            >
              Return to Homepage
            </button>
          </>
        ) : (
          <div className="flex justify-center items-center gap-2 mt-2">
            <p>Please wait</p>
            <Image
              src="/images/icons/spinner-dark-blue.png"
              alt="wait spinner"
              width={25}
              height={25}
              quality={100}
              className="animate-spin w-[23px] h-[23px]"
            />
          </div>
        )}
      </div>
      {/* Background image */}
      <div className="w-full min-h-svh absolute top-0 bottom-0 left-0 right-0 overflow-hidden z-[1]">
        <div className="overlay-layer z-[1]" />
        <Image
          src={getOptimizedImageUrl(images)}
          alt="Hazeltree Lodge"
          fill
          quality={100}
          className="object-cover object-center"
        />
      </div>
    </section>
  );
};

export default ConfirmationWrapper;
