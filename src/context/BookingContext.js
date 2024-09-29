/**
 * @file BookingContext.js
 * @description This context provides and manages booking details for the application. It allows components to access and update booking-related information globally. The `BookingProvider` component wraps the app, making the booking details accessible to all children components.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { createContext, useContext, useState } from "react";

// Create a context to manage booking details
const BookingContext = createContext();

/**
 * BookingProvider component
 *
 * Provides the booking details and function to update them across the app.
 * It wraps the app's components, allowing all children components to access the booking context.
 *
 * @param {React.ReactNode} children - The child components that will have access to the booking context.
 * @returns {JSX.Element} The provider component with context.
 */
export const BookingProvider = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState([]); // State to store booking details

  return (
    <BookingContext.Provider value={{ bookingDetails, setBookingDetails }}>
      {children}
    </BookingContext.Provider>
  );
};

/**
 * Custom hook to access the booking context
 *
 * Provides access to the booking details and function to update them.
 *
 * @returns {Object} The booking context, containing booking details and the function to set booking details.
 */
export const useBookingContext = () => useContext(BookingContext);
