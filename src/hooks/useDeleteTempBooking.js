/**
 * @file useDeleteTempBooking.js
 * @description Custom hook to handle the deletion of temporary bookings by sending a DELETE request. Manages loading state and errors.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import { useState, useCallback, useRef } from "react";

export const useDeleteTempBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref to track if a deletion is already in progress
  const isDeletingRef = useRef(false);

  /**
   * Deletes temporary bookings by sending a DELETE request with booking IDs as query parameters.
   *
   * @param {number[]} bookingIds - Array of booking IDs to delete.
   * @returns {boolean} - Returns true if deletion was successful or already deleted, false otherwise.
   */
  const deleteTempBooking = useCallback(async (bookingIds) => {
    if (isDeletingRef.current) {
      return false;
    }

    // Validate bookingIds
    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0) {
      setError("No booking IDs provided for deletion.");

      return false;
    }

    // Convert all IDs to numbers (in case they are strings)
    const numericIds = bookingIds.map((id) => Number(id));
    // Check if any failed to convert to a valid number
    if (numericIds.some((val) => isNaN(val))) {
      setError("Invalid booking IDs. Must be valid numbers.");
      return false;
    }

    // For debugging: see what IDs we're sending
    console.log("[useDeleteTempBooking] Deleting booking IDs:", numericIds);

    isDeletingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Construct query parameters
      const queryParams = numericIds
        .map((id) => `id=${encodeURIComponent(id)}`)
        .join("&");
      const url = `/api/delete-temp-booking?${queryParams}`;

      // For debugging
      console.log("[useDeleteTempBooking] DELETE request to:", url);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(`Server error: ${response.status} - ${errorText}`);
        console.error("Server error during deletion:", errorText);
        return false;
      }

      const result = await response.json();
      console.log("[useDeleteTempBooking] Delete response:", result);

      if (result.success) {
        return true;
      } else {
        // Handle specific errors
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((errorItem) => {
            if (
              errorItem.message &&
              errorItem.message.toLowerCase().includes("already deleted")
            ) {
            } else {
              console.error(
                `Error deleting booking ID ${errorItem.id}: ${errorItem.message}`
              );
            }
          });
          setError(result.errors);
        } else {
          setError("Failed to delete some bookings.");
          console.error("Unknown error structure:", result);
        }
        return false;
      }
    } catch (err) {
      setError("Error deleting bookings: " + err.message);
      console.error("Deletion Exception:", err);
      return false;
    } finally {
      isDeletingRef.current = false;
      setIsLoading(false);
    }
  }, []); // Empty dependency array ensures stable reference

  return { deleteTempBooking, isLoading, error };
};
