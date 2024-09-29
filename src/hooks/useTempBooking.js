/**
 * @file useTempBooking.js
 * @description Custom hook to handle temporary bookings in the application. Manages booking creation and tracks loading/error states.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import { useState } from "react";

/**
 * Custom hook to handle creating temporary bookings.
 *
 * @returns {Object} - Contains the function to create a temporary booking, loading state, and error state.
 */
export const useTempBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Creates temporary bookings by sending a POST request with the booking data.
   *
   * @param {Object} bookingData - The data for the temporary booking.
   * @returns {Array|null} - Returns an array of booking IDs if successful, otherwise null.
   */
  const createTempBooking = async (bookingData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-temp-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success) {
        return result.bookingIds; // Always return the array of bookingIds
      } else {
        setError(result.errors || "Failed to create booking");
        return null;
      }
    } catch (err) {
      setError("Error creating booking: " + err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createTempBooking, isLoading, error };
};
