/**
 * @file CheckoutCard.js
 * @description Displays a summary of the selected rooms and booking information, allowing the user to proceed to checkout. Integrates with Beds24 API to handle temporary bookings.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client"; // This component runs on the client side

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ButtonPrimary } from "@/components";
import { format } from "date-fns";
import Modal from "react-modal";
import { RiCloseLargeFill } from "react-icons/ri";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid"; // Import uuid
import { useRouter } from "next/navigation";
import { useTempBooking } from "@/hooks/useTempBooking";

/**
 * CheckoutCard Component
 *
 * Displays the selected rooms, total price, and booking details. Allows the user to proceed to checkout.
 *
 * @param {Object} searchData - Contains check-in, check-out, totalGuestsNumber, totalRoomsNumber, and nightsCount.
 * @param {Object} cmsResultData - CMS result data (e.g., check-in/out times, advantages, and policies).
 * @param {Array} selectedRooms - List of rooms selected by the user.
 * @param {Function} setSelectedRooms - Function to update selected rooms.
 * @param {Number} roomsLeftToSelect - Number of rooms left to select.
 * @param {Function} setRoomsLeftToSelect - Function to update rooms left to select.
 * @param {Boolean} isShowingAlternatives - Flag to indicate if alternative rooms are shown.
 * @param {Array} roomsRef - Reference to room data fetched from CMS.
 *
 * @returns {JSX.Element} The rendered CheckoutCard component.
 */
const CheckoutCard = ({
  searchData,
  cmsResultData,
  selectedRooms,
  setSelectedRooms,
  roomsLeftToSelect,
  roomsRef,
}) => {
  const [isCancellationPolicyModalOpen, setIsCancellationPolicyModalOpen] =
    useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const router = useRouter(); // Initialize router

  const { checkIn, checkOut } = searchData;

  const { checkInTime, checkOutTime, advantages, cancellationPolicy } =
    cmsResultData;

  /**
   * Handle removing a room from the selection.
   * @param {String} roomId - The ID of the room to remove.
   */
  const handleRemoveRoom = (roomId) => {
    // Find the room being removed
    const removedRoom = selectedRooms.find((room) => room.roomId === roomId);

    if (removedRoom) {
      setSelectedRooms(selectedRooms.filter((room) => room.roomId !== roomId)); // Remove room
    }
  };

  const { createTempBooking, isLoading, error } = useTempBooking();

  /**
   * Handle proceeding to the checkout process.
   */
  const handleProceedToCheckout = async () => {
    const bookingData = selectedRooms.map((room) => ({
      roomId: room.roomId,
      status: "inquiry", // Temporary status
      arrival: searchData.checkIn, // Check-in date
      departure: searchData.checkOut, // Check-out date
      numAdult: room.guestsCount,
      numChild: 0, // Always 0, as no children are allowed
    }));

    // Call the createTempBooking function from the hook
    const bookingIds = await createTempBooking(bookingData);

    if (bookingIds && bookingIds.length > 0) {
      // Generate a unique ID for the checkout session
      const sessionId = uuidv4();

      // Prepare the full booking data
      const fullBookingData = {
        bookingIds, // Store the array of Beds24 booking IDs
        searchData, // Existing searchData structure
        selectedRooms, // Array of selected rooms
        roomsRef,
        cmsResultData, // Room details, pricing, etc.
        timestamp: new Date().getTime(), // Store a timestamp for session expiration
        totalGuestsNumber: selectedRooms.reduce(
          (sum, room) => sum + room.guestCount,
          0
        ),
        totalRoomsNumber: selectedRooms.length,
        totalPrice: selectedRooms.reduce(
          (sum, room) => sum + room.totalPrice,
          0
        ),
        nightsCount: searchData.nightsCount,
        checkIn: searchData.checkIn,
        checkOut: searchData.checkOut,
      };

      // Store the data in sessionStorage with the unique session ID
      sessionStorage.setItem(
        `checkout_${sessionId}`,
        JSON.stringify(fullBookingData)
      );

      // Redirect to checkout page with the session ID
      router.push(`/booking/checkout/${sessionId}`);
    } else {
    }
  };

  // Calculate total rooms, total guests, and total price
  const totalRooms = selectedRooms.length;
  const totalGuests = selectedRooms.reduce(
    (sum, room) => sum + room.guestCount,
    0
  );
  const totalPrice = selectedRooms.reduce(
    (sum, room) => sum + room.totalPrice,
    0
  );

  // Set modal container in DOM
  useEffect(() => {
    if (typeof window !== "undefined") {
      const appElement = document.getElementById("__next");
      if (appElement) {
        Modal.setAppElement(appElement);
      }
    }
  }, []);

  // Open images modal
  const openCancellationPolicyModal = () => {
    setIsCancellationPolicyModalOpen(true);
    setTimeout(() => setIsAnimating(true), 50);
  };

  // Close images modal
  const closeCancellationPolicyModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsCancellationPolicyModalOpen(false), 200);
  };

  return (
    <div
      id="checkout"
      className=" w-full sm:w-[260px] min-w-[260px] lg:w-[315px] lg:min-w-[315px] flex flex-col items-center gap-4"
    >
      {/* show checkin and checkout */}
      <div className="w-full flex flex-col border-[#2e3778] border border-opacity-20">
        <div className="w-full flex justify-evenly sm:justify-center gap-4 p-4">
          <div>
            <p className="font-heavy text-s">Check-in</p>
            <p className="font-heavy">{format(checkIn, "dd MMM yyyy")}</p>
            <p className="text-s text-[#a8a8a8]">{checkInTime}</p>
          </div>
          <div className="w-px h-auto sm:hidden bg-[#2e3778] bg-opacity-20 mx-2" />
          <div className="sm:border-l-[#2e3778] sm:border-l sm:border-opacity-20 sm:pl-4">
            <p className="font-heavy text-s">Check-out</p>
            <p className="font-heavy">{format(checkOut, "dd MMM yyyy")}</p>
            <p className="text-s text-[#a8a8a8]">{checkOutTime}</p>
          </div>
        </div>
        <div className="w-full p-4 bg-secondary border-t-[#2e3778] border-t border-opacity-20 flex flex-col justify-start">
          {/* Display selected rooms */}
          {/* {selectedRooms.length > 0 && (
            <div className="w-full ">
              <h6 className="font-heavy">Selected Rooms:</h6>
              <ul className="mt-2 sm:mt-1">
                {selectedRooms.map((room, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center mb-3 sm:mb-1"
                  >
                    <p className="text-s">{room.name}</p>
                    <div className="flex justify-end">
                      <p className="text-s mr-3">
                        €
                        {(parseFloat(room.calendar?.[0]?.price1) * nightsCount)
                          .toFixed(2)
                          .replace(/\.00$/, "")}
                      </p>
                      <button
                        className="max-sm:hidden"
                        onClick={() => handleRemoveRoom(room.roomId)}
                      >
                        <RiCloseLargeFill
                          size={20}
                          className="text-error-text"
                        />
                      </button>
                      <button
                        className="sm:hidden text-error-text text-sm underline underline-offset-4"
                        onClick={() => handleRemoveRoom(room.roomId)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="w-full h-px bg-[#2e3778] bg-opacity-20 my-3" />
              <div className="w-full flex justify-between items-center">
                <h6 className="font-heavy">Total Price:</h6>
                <h3>€{totalPrice.toFixed(2)}</h3>
              </div>
            </div>
          )} */}

          {selectedRooms.map((room, index) => (
            <li
              key={index}
              className="flex justify-between items-center mb-3 sm:mb-1"
            >
              <div>
                <p className="text-s">{room.name}</p>
                <p className="text-xs text-gray-500">
                  Guests: {room.guestCount}
                </p>{" "}
                {/* Display guest count */}
              </div>
              <div className="flex justify-end">
                <p className="text-s mr-3">
                  €{room.totalPrice.toFixed(2).replace(/\.00$/, "")}
                </p>
                <button
                  className="max-sm:hidden"
                  onClick={() => handleRemoveRoom(room.roomId)}
                >
                  <RiCloseLargeFill size={20} className="text-error-text" />
                </button>
                <button
                  className="sm:hidden text-error-text text-sm underline underline-offset-4"
                  onClick={() => handleRemoveRoom(room.roomId)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}

          {selectedRooms.length > 0 && (
            <>
              <div className="w-full h-px bg-[#2e3778] bg-opacity-20 my-3" />
              <div className="w-full mb-3">
                <h6 className="font-heavy">Subtotal:</h6>
                <ul className="mt-2">
                  <li className="flex justify-between text-s">
                    <span>Total Rooms:</span>
                    <span>{totalRooms}</span>
                  </li>
                  <li className="flex justify-between text-s">
                    <span>Total Guests:</span>
                    <span>{totalGuests}</span>
                  </li>
                </ul>
              </div>
              {/* Total Price */}
              <div className="w-full flex justify-between items-center">
                <h6 className="font-heavy">Total Price:</h6>
                <h3>€{totalPrice.toFixed(2)}</h3>
              </div>
            </>
          )}

          {/* Proceed to Checkout Button */}
          {selectedRooms.length > 0 && (
            <div className="mb-2 w-full hidden sm:flex flex-col justify-center items-center gap-2 mt-2">
              <ButtonPrimary
                text="BOOK NOW"
                onClick={() => handleProceedToCheckout()}
                disabled={roomsLeftToSelect > 0}
              />

              {isLoading && (
                <Image
                  src="/images/icons/spinner-dark-blue.png"
                  alt="wait spinner"
                  width={25}
                  height={25}
                  quality={100}
                  className="animate-spin w-[23px] h-[23px]"
                />
              )}
              {error && (
                <p className="text-s text-error-text text-center">
                  There was an error processing your request. Please try again.
                </p>
              )}
            </div>
          )}

          {selectedRooms.length > 0 && (
            <div className="mb-2 w-full flex flex-col sm:hidden justify-center items-center mt-2 gap-2">
              <button
                className="w-full py-2 px-4 rounded-md bg-accent-green text-white transform active:scale-95 disabled:active:scale-100 disabled:opacity-50"
                disabled={roomsLeftToSelect > 0}
                onClick={() => handleProceedToCheckout()}
              >
                BOOK NOW
              </button>
              {isLoading && (
                <Image
                  src="/images/icons/spinner-dark-blue.png"
                  alt="wait spinner"
                  width={25}
                  height={25}
                  quality={100}
                  className="animate-spin w-[23px] h-[23px]"
                />
              )}
              {error && (
                <p className="text-s text-error-text">
                  There was an error processing your request. Please try again.
                </p>
              )}
            </div>
          )}

          {/* Display rooms to be selected */}
          {selectedRooms.length === 0 && (
            <p className="text-s text-center">Select a room</p>
          )}
        </div>
      </div>
      {/* advantages text */}
      <div className="w-full flex flex-col border-[#2e3778] border border-opacity-20 p-4">
        <p className="font-heavy">Why book directly?</p>
        <div className="w-full flex flex-col justify-start">
          {advantages.split("\n").map((line, index) => (
            <p key={index} className="text-s text-left">
              {line}
            </p>
          ))}
        </div>
        <Link
          href={`/breakfast-menu`}
          target="_blank"
          className="text-accent-green underline underline-offset-4 mt-2"
        >
          View breakfast menu
        </Link>
      </div>
      {/* policies reminder */}
      <div className="w-full flex flex-col bg-secondary border-[#2e3778] border border-opacity-20 p-4 gap-2">
        <p className="text-s">100% of deposit is required</p>
        <div className="w-full h-px bg-[#2e3778] bg-opacity-20" />
        <p className="text-s">
          Learn more about our{" "}
          <span>
            <button
              onClick={openCancellationPolicyModal}
              className="text-accent-green underline underline-offset-4 mt-2"
            >
              Cancellation Policy
            </button>
          </span>
        </p>
        <div className="w-full h-px bg-[#2e3778] bg-opacity-20" />
        <p className="text-s">
          Need assistance?{" "}
          <span>
            <Link
              href={`/contact`}
              target="_blank"
              className="text-accent-green underline underline-offset-4 mt-2"
            >
              Contact Us
            </Link>
          </span>
        </p>
      </div>

      <CancellationPolicyModal
        isOpen={isCancellationPolicyModalOpen}
        onRequestClose={closeCancellationPolicyModal}
        isAnimating={isAnimating}
        policy={cancellationPolicy}
      />
    </div>
  );
};

/**
 * CancellationPolicyModal Component
 *
 * Displays the cancellation policy in a modal.
 *
 * @param {Boolean} isOpen - Determines if the modal is open.
 * @param {Function} onRequestClose - Callback to close the modal.
 * @param {Boolean} isAnimating - Controls animation of the modal.
 * @param {String} policy - The cancellation policy text.
 *
 * @returns {JSX.Element} The rendered CancellationPolicyModal component.
 */
const CancellationPolicyModal = ({
  isOpen,
  onRequestClose,
  isAnimating,
  policy,
}) => {
  useEffect(() => {
    if (isOpen) {
      // body overflow is hidden when this component is active
      document.body.style.overflow = "hidden";
    }

    return () => {
      // Re-enable scrolling when this component is unmounted
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false} // Disables hiding app for screen readers when modal is open
      className={`bg-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] shadow-lg outline-none focus:outline-none max-lg:w-[90%] max-w-[90%] lg:max-w-[730px] h-auto transition-all duration-200 ease-in-out overflow-auto modalScrollBar ${
        isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      overlayClassName="fixed inset-0 bg-[#000000bf] backdrop-blur-[2px] z-[9999]"
    >
      {/* title */}
      <div className="relative w-full flex justify-center items-center pt-3 px-4">
        <h3 className="text-black text-4xl">Cancellation Policy</h3>
        <button
          onClick={onRequestClose}
          className="absolute right-4  cursor-pointer z-50"
        >
          <RiCloseLargeFill size={25} />
        </button>
      </div>

      <div className="py-6 px-8 flex flex-col gap-4">
        {policy.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </Modal>
  );
};

export default CheckoutCard;
