/**
 * @file BookingSearchResults.js
 * @description Component to display room search results based on user inputs, allocate rooms, and provide alternative room suggestions. Integrates with Beds24 API for room offers.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client"; // This component runs on the client side

import React, { useEffect, useState } from "react";
import { useBeds24RoomsOffers } from "@/hooks/useBeds24RoomsOffers";
import { allocateRooms } from "@/utils/allocateRooms";
import { generateAlternativeRooms } from "@/utils/generateAlternativeRooms";
import { RoomCard, CheckoutCard } from "@/components";
import { format } from "date-fns";

/**
 * BookingSearchResults Component
 *
 * Displays room search results based on the user's search data, allocates rooms,
 * and provides alternative room suggestions if the initial search does not yield exact matches.
 * It also handles the room selection process for the user.
 *
 * @param {Object} searchData - Contains check-in, check-out, totalGuestsNumber, totalRoomsNumber, and nightsCount.
 * @param {Function} onSearchComplete - Callback to notify when the search and allocation process is done.
 * @param {Array} roomsRef - Rooms reference data fetched from the CMS.
 * @param {Object} cmsResultData - CMS result data for check-in/out times, cancellation policies, etc.
 *
 * @returns {JSX.Element} The rendered BookingSearchResults component.
 */
const BookingSearchResults = ({
  searchData,
  onSearchComplete,
  roomsRef,
  cmsResultData,
}) => {
  const { checkIn, checkOut, nightsCount } = searchData;

  // Use the custom hook to fetch room offers based on search data
  const {
    data: roomsOffers,
    isLoading,
    isError,
  } = useBeds24RoomsOffers(checkIn, checkOut);

  // States for allocate rooms and alternatives
  // const [allocatedRooms, setAllocatedRooms] = useState([]);
  // const [alternativeRooms, setAlternativeRooms] = useState([]);

  // States for handling rooms selections
  const [selectedRooms, setSelectedRooms] = useState([]);
  // const [roomsLeftToSelect, setRoomsLeftToSelect] = useState(totalRoomsNumber);
  // const [isShowingAlternatives, setIsShowingAlternatives] = useState(false);
  const [previousCheckIn, setPreviousCheckIn] = useState(null);
  const [previousCheckOut, setPreviousCheckOut] = useState(null);
  //const [previousGuestsNumber, setPreviousGuestsNumber] = useState(null);
  // const [previousRoomsNumber, setPreviousRoomsNumber] = useState(null);
  //const [isAllocatingRooms, setIsAllocatingRooms] = useState(true); // New state to track allocation progress

  // Reset state when totalRoomsNumber changes
  // useEffect(() => {
  // Reset state on every new search
  // setRoomsLeftToSelect(totalRoomsNumber); // Reset roomsLeftToSelect
  //  setSelectedRooms([]); // Clear previously selected rooms
  // }, [totalRoomsNumber, totalGuestsNumber, checkIn, checkOut]);

  // useEffect(() => {
  //   // Determine if search parameters have changed
  //   const isNewSearch =
  //     checkIn !== previousCheckIn ||
  //     checkOut !== previousCheckOut;

  //   // Only proceed if not loading and roomsOffers are available
  //   if (!isLoading && roomsOffers.length > 0) {
  //     if (isNewSearch) {
  //       setIsAllocatingRooms(true); // Start allocation

  //       // Reset states for the new search
  //       setAllocatedRooms([]);
  //       setAlternativeRooms([]);
  //       setSelectedRooms([]);
  //       setRoomsLeftToSelect(totalRoomsNumber);

  //       // Allocate rooms based on the new search parameters
  //       const allocated = allocateRooms(
  //         totalGuestsNumber,
  //         totalRoomsNumber,
  //         roomsOffers,
  //         roomsRef,
  //         checkIn,
  //         checkOut
  //       );

  //       setAllocatedRooms(allocated);

  //       // Handle alternative rooms if no exact match is found
  //       if (allocated.length === 0) {
  //         const alternatives = generateAlternativeRooms(
  //           totalGuestsNumber,
  //           roomsOffers,
  //           roomsRef,
  //           checkIn,
  //           checkOut
  //         );

  //         setAlternativeRooms(alternatives);
  //         setIsShowingAlternatives(true);

  //         // Set the minimum number of rooms required from the alternatives
  //         if (alternatives.length > 0) {
  //           const minRoomsNeeded = Math.min(
  //             ...alternatives.map((c) => c.length)
  //           );
  //           setRoomsLeftToSelect(minRoomsNeeded);
  //         } else {
  //           setRoomsLeftToSelect(0);
  //         }
  //       } else {
  //         setAlternativeRooms([]);
  //         setIsShowingAlternatives(false);
  //         setRoomsLeftToSelect(totalRoomsNumber);
  //       }

  //       setIsAllocatingRooms(false); // Allocation complete

  //       // Update previous search values
  //       setPreviousCheckIn(checkIn);
  //       setPreviousCheckOut(checkOut);
  //       setPreviousGuestsNumber(totalGuestsNumber);
  //       setPreviousRoomsNumber(totalRoomsNumber);
  //     } else {
  //       setIsAllocatingRooms(true); // Start allocation

  //       const allocated = allocateRooms(
  //         totalGuestsNumber,
  //         totalRoomsNumber,
  //         roomsOffers,
  //         roomsRef,
  //         checkIn,
  //         checkOut
  //       );

  //       setAllocatedRooms(allocated);

  //       if (allocated.length === 0) {
  //         const alternatives = generateAlternativeRooms(
  //           totalGuestsNumber,
  //           roomsOffers,
  //           roomsRef,
  //           checkIn,
  //           checkOut
  //         );

  //         setAlternativeRooms(alternatives);
  //         setIsShowingAlternatives(true);

  //         if (alternatives.length > 0) {
  //           const minRoomsNeeded = Math.min(
  //             ...alternatives.map((c) => c.length)
  //           );
  //           setRoomsLeftToSelect(minRoomsNeeded);
  //         } else {
  //           setRoomsLeftToSelect(0);
  //         }
  //       } else {
  //         setAlternativeRooms([]);
  //         setIsShowingAlternatives(false);
  //         setRoomsLeftToSelect(totalRoomsNumber);
  //       }

  //       setIsAllocatingRooms(false); // Allocation complete
  //     }
  //   }

  //   // Trigger parent to stop loading spinner when search is done
  //   if (!isLoading && !isError) {
  //     onSearchComplete();
  //   }
  // }, [
  //   checkIn,
  //   checkOut,
  //   totalRoomsNumber,
  //   totalGuestsNumber,
  //   isLoading,
  //   roomsOffers,
  // ]);

  // Trigger parent to stop loading spinner when search is done
  useEffect(() => {
    if (!isLoading && !isError) {
      onSearchComplete(); // Call the parent function to hide the spinner
    }
  }, [isLoading, isError, onSearchComplete]);

  if (isLoading) {
    return null; // Return null to keep the spinner visible in the parent
  }

  if (isError) {
    return (
      <div className="w-full h-full p-4 justify-center items-center">
        <p className="text-center">
          Failed to load room offers. Please try again later.
        </p>
      </div>
    );
  }

  if (!isLoading && roomsOffers.length === 0) {
    return (
      <div className="w-full h-full p-4 justify-center items-center">
        <p className="text-center">
          No rooms available for your selected dates.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col items-center px-4 xl:px-12 2xl:px-40 pb-12 pt-1 xl:pt-12 gap-4 xl:gap-6">
      <div className="w-full bg-secondary p-2 sm:p-4">
        <h6 className="text-dark-blue font-heavy text-lg">
          View availability for:
        </h6>
        <ul className="text-s list-disc pl-4">
          <li>Check-in: {format(new Date(checkIn), "dd MMMM yyyy")}</li>
          <li>Check-out: {format(new Date(checkOut), "dd MMMM yyyy")}</li>
          <li>
            {nightsCount} night{nightsCount === 1 ? "" : "s"}
          </li>
        </ul>
        <div className="h-px w-full bg-[#2e3778] bg-opacity-20 my-2" />

        <p>
          <span className="font-heavy">{roomsOffers.length}</span> room
          {roomsOffers.length === 1 ? "" : "s"} available
        </p>
      </div>
      {/* Display room cards */}
      <div className="max-sm:w-full flex sm:flex-grow flex-col sm:flex-row h-fit gap-4 sm:gap-2 xl:gap-4">
        <div className="flex flex-grow flex-col gap-4 xl:gap-6">
          {roomsOffers.map((room) => {
            const cmsRoom = roomsRef.find(
              (cmsRoom) => String(cmsRoom.roomId) === String(room.roomId)
            );
            return cmsRoom ? (
              <div key={room.roomId} className="flex flex-grow">
                <RoomCard
                  cmsRoom={cmsRoom}
                  apiRoom={room}
                  cmsResultData={cmsResultData}
                  searchData={searchData}
                  selectedRooms={selectedRooms}
                  setSelectedRooms={setSelectedRooms}
                />
              </div>
            ) : null;
          })}
        </div>
        <CheckoutCard
          searchData={searchData}
          cmsResultData={cmsResultData}
          selectedRooms={selectedRooms}
          setSelectedRooms={setSelectedRooms}
          roomsRef={roomsRef}
        />
      </div>
    </section>
  );
};

export default BookingSearchResults;
