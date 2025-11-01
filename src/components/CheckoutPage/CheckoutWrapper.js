/**
 * @file CheckoutWrapper.js
 * @description Checkout page component that manages the booking session and payment process. It handles session expiration, temporary booking deletion, and navigation to Stripe for payment processing. The component uses sessionStorage to retrieve and manage booking data and integrates with Stripe for secure payments.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import { Header } from "@/components";
import Image from "next/image";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/CheckoutPage/CheckoutForm";
import { useDeleteTempBooking } from "@/hooks/useDeleteTempBooking";

// Initialize Stripe - TEST
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
);

// Initialize Stripe
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// );

/**
 * CheckoutWrapper Component
 *
 * This component manages the booking checkout process, including session expiration, temporary booking handling, and interaction with the Stripe payment gateway.
 *
 * @returns {JSX.Element} The rendered CheckoutWrapper component.
 */
const CheckoutWrapper = () => {
  const { id } = useParams(); // Retrieve the unique ID from the URL
  const router = useRouter();
  const pathname = usePathname();
  const [bookingData, setBookingData] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const { deleteTempBooking, isLoading, error } = useDeleteTempBooking();
  const [bookingComplete, setBookingComplete] = useState(false);
  const [isGoingToEdit, setIsGoingToEdit] = useState(false);
  // State to check if it's submittig payments
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const isSubmittingPaymentRef = useRef(false);

  // Ref to store previous pathname
  const prevPathname = useRef(pathname);
  // Ref to prevent multiple deletions
  const deletionTriggered = useRef(false);

  const handleSetIsSubmittingPayment = (value) => {
    isSubmittingPaymentRef.current = value;
    setIsSubmittingPayment(value);
  };

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        // Get paymentIntentId from bookingData (stored in sessionStorage)
        const storedData = sessionStorage.getItem(`checkout_${id}`);
        if (!storedData) {
          setIsExpired(true);
          return;
        }

        const parsedData = JSON.parse(storedData);
        const paymentIntentId = parsedData.paymentIntentId;

        if (!paymentIntentId) {
          return;
        }

        const res = await fetch(
          `/api/checkout-status/${id}?paymentIntentId=${paymentIntentId}`
        );
        const info = await res.json();

        if (info.status === "paid") {
          router.replace(`/booking/confirmation/${id}`);
          return;
        }
        if (info.status === "expired") {
          setIsExpired(true);
        }
      } catch (err) {
        console.error("status check failed", err);
      }
    })();
  }, [id, router]);

  useEffect(() => {
    function onBeforeUnload(e) {
      // If user already completed or we triggered deletion, skip
      if (
        bookingComplete ||
        deletionTriggered.current ||
        isSubmittingPaymentRef.current
      ) {
        return;
      }

      // Show a synchronous confirm
      const message = "Are you sure you want to leave this page?";
      const userWantsToLeave = window.confirm(message);

      if (!userWantsToLeave) {
        // user pressed CANCEL => block navigation
        e.preventDefault();
        e.returnValue = false;
        return false; // for older browsers
      }

      // user pressed OK => do final delete quickly
      if (bookingData?.bookingIds?.length) {
        deletionTriggered.current = true;
        try {
          const body = JSON.stringify({ bookingIds: bookingData.bookingIds });
          navigator.sendBeacon(
            "/api/delete-temp-booking",
            new Blob([body], { type: "application/json" })
          );
          sessionStorage.removeItem(`checkout_${id}`);
        } catch (err) {
          console.error("Beacon final delete failed:", err);
        }
      }
      // return undefined to let the unload proceed
      return undefined;
    }

    window.onbeforeunload = onBeforeUnload;
    return () => {
      window.onbeforeunload = null;
    };
  }, [bookingData, bookingComplete, id]);

  /**
   * Fetch booking data from sessionStorage on component mount.
   * Initialize session expiration timer.
   */
  useEffect(() => {
    if (id) {
      // Fetch the booking data from Session Storage
      const storedData = sessionStorage.getItem(`checkout_${id}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);

        // Check for session expiration (e.g., 30 minutes)
        const currentTime = new Date().getTime();
        const sessionDuration = 20 * 60 * 1000; // 20 minutes in milliseconds
        const timeRemaining =
          sessionDuration - (currentTime - parsedData.timestamp);
        if (timeRemaining <= 0) {
          // Session has expired
          setIsExpired(true);
        } else {
          setBookingData(parsedData);
          setTimeLeft(timeRemaining);

          // Initialize countdown timer
          const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
              if (prevTime <= 1000) {
                clearInterval(timer);
                setIsExpired(true);
                sessionStorage.removeItem(`checkout_${id}`);
                return 0;
              }
              return prevTime - 1000;
            });
          }, 1000);

          // Cleanup the interval on component unmount
          return () => clearInterval(timer);
        }
      } else {
        // No data found for the given ID
        setIsExpired(true);
      }
    }
  }, [id]);

  /**
   * Format the remaining time as MM:SS.
   */
  const formatTimeLeft = () => {
    if (timeLeft === null) return "";
    let totalSeconds = Math.floor(timeLeft / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  /**
   * Handle "Edit Booking" button click.
   * Delete temporary bookings and redirect to booking page.
   */
  const handleBack = () => {
    setIsGoingToEdit(true);
    if (
      bookingData &&
      bookingData.bookingIds &&
      bookingData.bookingIds.length > 0 &&
      !deletionTriggered.current
    ) {
      deletionTriggered.current = true; // Prevent multiple deletions

      deleteTempBooking(bookingData.bookingIds).then((success) => {
        if (success) {
          // Remove booking data from sessionStorage to prevent forward navigation
          sessionStorage.removeItem(`checkout_${id}`);
        } else {
          console.error("Some temporary bookings failed to delete.");
        }
        router.replace("/booking"); // Replace history to prevent back navigation
      });
    } else {
      router.replace("/booking");
    }
  };

  /**
   * Handle session expiration.
   * Delete temporary bookings and redirect to booking page.
   */
  useEffect(() => {
    if (
      isExpired &&
      bookingData &&
      bookingData.bookingIds &&
      bookingData.bookingIds.length > 0 &&
      !deletionTriggered.current
    ) {
      deletionTriggered.current = true; // Prevent multiple deletions

      deleteTempBooking(bookingData.bookingIds).then((success) => {
        if (success) {
          // Remove booking data from sessionStorage to prevent forward navigation
          sessionStorage.removeItem(`checkout_${id}`);
        } else {
          console.error("Some temporary bookings failed to delete.");
        }
        router.replace("/booking"); // Redirect after deletion
      });
    }
  }, [isExpired, bookingData, deleteTempBooking, router, id]);

  /**
   * Handle browser/tab closure.
   * Use navigator.sendBeacon to send a deletion request via POST.
   */
  useEffect(() => {
    const handlePageUnload = (event) => {
      // Only execute if deletion has not already been triggered
      if (
        !deletionTriggered.current &&
        !isSubmittingPaymentRef.current &&
        bookingData &&
        bookingData.bookingIds &&
        bookingData.bookingIds.length > 0
      ) {
        deletionTriggered.current = true; // Set the flag to prevent multiple deletions

        // Prepare the data
        const requestData = JSON.stringify({
          bookingIds: bookingData.bookingIds,
        });
        const blob = new Blob([requestData], { type: "application/json" });

        // Send the POST request via sendBeacon
        navigator.sendBeacon("/api/delete-temp-booking", blob);

        // Remove booking data from sessionStorage to prevent forward navigation
        sessionStorage.removeItem(`checkout_${id}`);
      }
    };

    window.addEventListener("beforeunload", handlePageUnload);

    return () => {
      window.removeEventListener("beforeunload", handlePageUnload);
    };
  }, [bookingData, id]);

  /**
   * Handle route changes (e.g., navigating to a different page).
   * Delete temporary bookings and redirect to booking page.
   */
  useEffect(() => {
    // Check if the current pathname is different from the previous one
    if (pathname !== prevPathname.current) {
      deletionTriggered.current = true; // Set the flag to prevent multiple deletions

      // Delete temporary bookings
      deleteTempBooking(bookingData.bookingIds).then((success) => {
        if (success) {
          // Remove booking data from sessionStorage to prevent forward navigation
          sessionStorage.removeItem(`checkout_${id}`);
        } else {
          console.error("Some temporary bookings failed to delete.");
        }

        // Redirect after deletion
        router.replace("/booking");
      });

      // Update the previous pathname to the current one
      prevPathname.current = pathname;
    }
  }, [pathname, bookingData, deleteTempBooking, router, id]);

  /**
   * Render session expired message.
   */
  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h5 className="text-3xl font-bold mb-4 text-black">Session Expired</h5>
        <p className="mb-6 text-black">
          Your checkout session has expired. Please start a new booking.
        </p>

        <button
          className="py-2 px-4 rounded-md bg-dark-blue text-white transform active:scale-95"
          onClick={handleBack}
          disabled={isLoading} // Disable button while deletion is in progress
        >
          {isLoading ? "Loading..." : "Go to Booking Page"}
        </button>
      </div>
    );
  }

  /**
   * Render loading state.
   */
  if (!bookingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <p className="text-lg">Loading your booking details...</p>
        <Image
          src="/images/icons/spinner-dark-blue.png"
          alt="wait spinner"
          width={30}
          height={30}
          quality={100}
          className="animate-spin w-[30px] h-[30px]"
        />
      </div>
    );
  }

  /**
   * Destructure booking data.
   */
  const { searchData, selectedRooms } = bookingData;

  const { checkIn, checkOut, nightsCount } = searchData;

  /**
   * Calculate guests.
   */
  const totalGuests = selectedRooms.reduce(
    (sum, room) => sum + room.guestCount,
    0
  );

  /**
   * Calculate total price.
   */
  const totalPrice = selectedRooms.reduce((sum, room) => {
    let roomPricePerNight;

    // Determine the correct price based on guestCount
    if (room.guestCount === 2) {
      roomPricePerNight = parseFloat(room.calendar?.[0].price1) || 0;
    } else if (room.guestCount === 3) {
      roomPricePerNight =
        parseFloat(room.calendar?.[0].price2) ||
        parseFloat(room.calendar?.[0].price1) ||
        0;
    } else if (room.guestCount === 4) {
      roomPricePerNight =
        parseFloat(room.calendar?.[0].price3) ||
        parseFloat(room.calendar?.[0].price2) ||
        parseFloat(room.calendar?.[0].price1) ||
        0;
    } else {
      roomPricePerNight = parseFloat(room.calendar?.[0].price1) || 0; // Fallback
    }

    // Calculate total for the room and accumulate
    const roomTotalPrice = roomPricePerNight * nightsCount;
    return sum + roomTotalPrice;
  }, 0);

  /**
   * Render the main checkout page.
   */
  return (
    <section className="w-full flex flex-col items-center ">
      <Header />
      <div className="w-full h-px bg-[#2e3778] bg-opacity-20 mt-4" />
      <div className="w-full px-4 md:px-6 lg:px-32 xl:px-40 py-6 max-[567px]:mt-16">
        <div className="w-full bg-secondary p-4">
          <p className="text-sm mb-2">
            This session will expire in 00:{formatTimeLeft()}
          </p>
          <h6 className="text-dark-blue font-heavy text-lg">
            Checkout Summary
          </h6>
          <ul className="text-s list-disc pl-4">
            <li>
              Check-in:{" "}
              <span className="font-heavy">
                {format(new Date(checkIn), "dd MMM yyyy")}
              </span>
            </li>
            <li>
              Check-out:{" "}
              <span className="font-heavy">
                {format(new Date(checkOut), "dd MMM yyyy")}
              </span>
            </li>
            <li>
              Nights: <span className="font-heavy">{nightsCount}</span>
            </li>
            <li>
              Guests: <span className="font-heavy">{totalGuests}</span>
            </li>
            <li>
              Rooms selected:{" "}
              <span className="font-heavy">{selectedRooms.length}</span>
            </li>
          </ul>
        </div>

        {/* Display selected rooms */}
        <div className="w-full flex flex-col ">
          {selectedRooms.map((room, index) => {
            let roomPricePerNight;

            // Determine the correct price based on guestCount
            if (room.guestCount === 2) {
              roomPricePerNight = parseFloat(room.calendar?.[0]?.price1) || 0;
            } else if (room.guestCount === 3) {
              roomPricePerNight =
                parseFloat(room.calendar?.[0]?.price2) ||
                parseFloat(room.calendar?.[0]?.price1) ||
                0;
            } else if (room.guestCount === 4) {
              roomPricePerNight =
                parseFloat(room.calendar?.[0]?.price3) ||
                parseFloat(room.calendar?.[0]?.price2) ||
                parseFloat(room.calendar?.[0]?.price1) ||
                0;
            } else {
              roomPricePerNight = parseFloat(room.calendar?.[0]?.price1) || 0; // Fallback
            }

            // Calculate total for this room
            const roomTotalPrice = roomPricePerNight * nightsCount;

            return (
              <div key={index} className="flex flex-col border p-4 ">
                <h6 className="text-lg md:text-xl font-bold">{room.name}</h6>
                <p className="text-s md:text-base">
                  Price per night: €{roomPricePerNight.toFixed(2)}
                </p>
                <p className="text-base">
                  Total for {nightsCount} night(s): €{roomTotalPrice.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Total Price */}
        <div className="w-full flex justify-between items-center border-l border-r border-b p-4 flex-wrap gap-2">
          <h3 className="text-lg md:text-2xl font-bold">
            Total Price: €{totalPrice.toFixed(2)}
          </h3>
          <button
            className="py-2 px-4 rounded-md bg-dark-blue text-white transform active:scale-95 disabled:active:scale-100 disabled:opacity-50"
            onClick={handleBack}
            disabled={isLoading || isGoingToEdit} // Disable button while deletion is in progress
          >
            {isLoading || isGoingToEdit ? "Loading..." : "Edit Booking"}
          </button>
        </div>
      </div>
      <div className="w-full px-4 md:px-6 lg:px-32 xl:px-40 md:py-6 mb-8">
        <Elements stripe={stripePromise}>
          <CheckoutForm
            totalPrice={totalPrice}
            bookingData={bookingData}
            sessionId={id}
            setBookingComplete={setBookingComplete}
            setIsSubmittingPayment={handleSetIsSubmittingPayment}
          />
        </Elements>
      </div>
    </section>
  );
};

export default CheckoutWrapper;
