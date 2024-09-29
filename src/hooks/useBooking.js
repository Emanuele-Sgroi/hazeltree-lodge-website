/**
 * @file useBooking.js
 * @description Custom hook to handle booking operations with Beds24, including creating and updating bookings. It manages loading and error states during API interactions.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import { useState } from "react";

/**
 * Custom hook to handle booking operations with Beds24.
 * Includes functions to create and update bookings.
 */
export const useBooking = () => {
  const [isLoading, setIsLoading] = useState(false); // Tracks loading state
  const [error, setError] = useState(null); // Tracks error messages

  /**
   * Creates new temporary bookings in Beds24.
   * @param {Array} bookingData - Array of booking objects to create.
   * @returns {Array|null} - Returns an array of booking IDs if successful, otherwise null.
   */
  const createBooking = async (bookingData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success) {
        return result.bookingIds; // Return the array of booking IDs
      } else {
        console.error("Booking creation errors:", result.errors);
        setError(result.errors || "Failed to create booking.");
        return null;
      }
    } catch (err) {
      console.error("Error in createBooking:", err);
      setError("Error creating booking: " + err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates existing bookings in Beds24.
   * @param {Array} bookingUpdates - Array of booking update objects.
   * Each object should contain the 'id' and fields to update.
   * @returns {boolean} - Returns true if all updates were successful, otherwise false.
   */
  const updateBooking = async (bookingUpdates) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/update-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingUpdates),
      });

      const result = await response.json();

      if (result.success) {
        return true; // Indicate success
      } else {
        console.error("Booking update errors:", result.errors);
        setError(result.errors || "Failed to update booking.");
        return false;
      }
    } catch (err) {
      console.error("Error in updateBooking:", err);
      setError("Error updating booking: " + err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { createBooking, updateBooking, isLoading, error };
};
