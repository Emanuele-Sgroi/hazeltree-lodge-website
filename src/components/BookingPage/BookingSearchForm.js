/**
 * @file BookingSearchForm.js
 * @description Booking search form component that allows users to select check-in/check-out dates, room and guest numbers, and search for availability. Integrates with Beds24 API to fetch pricing and availability data.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client"; // This component runs on the client side

import React, { useState, useEffect } from "react";
import { mutate } from "swr";
import { useBeds24Calendar } from "@/hooks/useBeds24Calendar";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import enGB from "date-fns/locale/en-GB"; // Import locale to start the week on Monday
registerLocale("en-GB", enGB); // Register locale
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
import "./datapicker.css"; // Custom styles for Datapicker
import {
  addDays,
  differenceInDays,
  format,
  isSameDay,
  setHours,
  setMinutes,
  differenceInCalendarMonths,
  addMonths,
} from "date-fns";
import Modal from "react-modal";
import classNames from "classnames";
import { PiWarningCircle } from "react-icons/pi";
import { IoClose, IoMoonOutline, IoBedOutline } from "react-icons/io5";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";
import Loading from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

/**
 * BookingSearchForm Component
 *
 * Handles booking form inputs including dates, guests, and rooms. Fetches availability and price data from the Beds24 API.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.showPrices - Whether to display prices in the date picker.
 * @param {string} props.infoText - Additional information text to show about prices.
 * @param {number} props.dayCutoff - The cutoff hour for same-day bookings.
 * @param {number} props.maxStay - Maximum number of nights allowed.
 * @param {number} props.maxGuests - Maximum number of guests allowed.
 * @param {number} props.maxRooms - Maximum number of rooms selectable.
 * @param {Date} props.maxBookingDate - The last available booking date.
 * @param {string} props.guestLabel - Label to display for guest count.
 * @param {boolean} props.showAgeLimitText - Whether to show age limit information.
 * @param {string} props.ageLimitText - The text to display for age restrictions.
 * @param {function} props.onSearch - Function to execute when the search button is clicked.
 * @param {Object} props.initialSearchData - Initial data to populate the search form.
 *
 * @returns {JSX.Element} The rendered BookingSearchForm component.
 */
const BookingSearchForm = ({
  showPrices,
  infoText,
  dayCutoff,
  maxStay,
  maxBookingDate,
  totalMonthsForCalendar,
  showAgeLimitText,
  ageLimitText,
  onSearch,
  initialSearchData,
}) => {
  // Default dates for check-in and check-out
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);

  // Define cutoff time for same-day bookings
  const sameDayCutoff = setHours(setMinutes(new Date(), 0), dayCutoff);

  // Determine if today is after the cutoff time
  const isAfterCutoff = new Date() > sameDayCutoff;

  // Set default start and end dates based on cutoff
  const initialStartDate = isAfterCutoff ? tomorrow : today;
  const initialEndDate = isAfterCutoff ? dayAfterTomorrow : tomorrow;

  // States for date selection
  const [startDate, setStartDate] = useState(
    initialSearchData?.checkIn
      ? new Date(initialSearchData.checkIn)
      : initialStartDate
  );
  const [endDate, setEndDate] = useState(
    initialSearchData?.checkOut
      ? new Date(initialSearchData.checkOut)
      : initialEndDate
  );

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const initialNightsCount = initialSearchData
    ? differenceInDays(
        new Date(initialSearchData.checkOut),
        new Date(initialSearchData.checkIn)
      )
    : differenceInDays(initialEndDate, initialStartDate);

  const [nightsCount, setNightsCount] = useState(initialNightsCount);
  const [isMobile, setIsMobile] = useState(false);

  //selection of price and date
  const [isDateValid, setIsDateValid] = useState(true);
  const [isDateSelected, setIsDateSelected] = useState(true);
  const [pricesPerDay, setPricesPerDay] = useState({});

  //format date for the API
  const apiStartDate = format(initialStartDate, "yyy-MM-dd");
  const apiEndDate = format(maxBookingDate, "yyyy-MM-dd");

  const { content, lowestPricesPerDay, availabilityData, isLoading, isError } =
    useBeds24Calendar(apiStartDate, apiEndDate);

  // Fetch prices and store them in state
  useEffect(() => {
    if (lowestPricesPerDay) {
      setPricesPerDay(lowestPricesPerDay);
    }
  }, [lowestPricesPerDay]);

  useEffect(() => {
    if (initialSearchData) {
      setStartDate(new Date(initialSearchData.checkIn));
      setEndDate(new Date(initialSearchData.checkOut));
      setNightsCount(initialSearchData.nightsCount);
    }
  }, [initialSearchData]);

  // Format a date or return a placeholder
  const formatDate = (date, text) =>
    date ? format(date, "dd MMM yyyy") : text;

  // Format check-in and check-out dates
  const formattedStartDate = formatDate(startDate, "Select check-in");
  const formattedEndDate = formatDate(endDate, "Select check-out");

  // Calculate the max check-in date
  const maxCheckinDate = addDays(maxBookingDate, -0);

  //total months for datapicker
  const totalMonths =
    differenceInCalendarMonths(
      addMonths(today, totalMonthsForCalendar),
      today
    ) + 1;

  // disable dates that are not available
  const isDateDisabled = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");

    // Check if any room is unavailable on this date
    const isUnavailable = availabilityData?.data?.every(
      (room) => room.availability[formattedDate] === false
    );

    // Disable today if past the same-day cutoff
    const isTodayAfterCutoff =
      isSameDay(date, today) && new Date() > sameDayCutoff;
    const isPastDate = date < today.setHours(0, 0, 0, 0) || isTodayAfterCutoff;

    // Disable dates beyond maxBookingDate
    const isBeyondMaxBookingDate = date > maxCheckinDate;

    // Check if this is the first unavailable day in a sequence
    const previousDate = addDays(date, -1);
    const isPreviousDayAvailable = availabilityData?.data?.some(
      (room) => room.availability[format(previousDate, "yyyy-MM-dd")] === true
    );
    const isFirstUnavailableDay = isUnavailable && isPreviousDayAvailable;

    // Ensure it's a valid checkout only if within "maxStay" days of check-in
    const isWithinFiveDays =
      startDate &&
      differenceInDays(date, startDate) <= maxStay &&
      differenceInDays(date, startDate) > 0;
    const isValidCheckout = isFirstUnavailableDay && isWithinFiveDays;
    return (
      isPastDate ||
      isBeyondMaxBookingDate ||
      (isUnavailable && !isValidCheckout)
    );
  };

  // Preload prices for the date range shown in the date picker
  const getPriceForDate = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return pricesPerDay[formattedDate] ? `€${pricesPerDay[formattedDate]}` : "";
  };

  //custom component for the day in the date picker
  const renderDayContents = (day, date) => {
    const price = getPriceForDate(date);
    const formattedDate = format(date, "yyyy-MM-dd");

    // Check if all rooms are unavailable for this date
    const isUnavailable = availabilityData?.data?.every(
      (room) => room.availability[formattedDate] === false
    );

    const isTodayAfterCutoff =
      isSameDay(date, today) && new Date() > sameDayCutoff;
    const isPastDate = date < today.setHours(0, 0, 0, 0) || isTodayAfterCutoff;

    const isSelectedStart =
      startDate && date.toDateString() === startDate.toDateString();
    const isSelectedEnd =
      endDate && date.toDateString() === endDate.toDateString();
    const isInRange =
      startDate && endDate && date > startDate && date < endDate;

    // Check if this is the first unavailable day in a sequence
    const previousDate = addDays(date, -1);
    const isPreviousDayAvailable = availabilityData?.data?.some(
      (room) => room.availability[format(previousDate, "yyyy-MM-dd")] === true
    );
    const isFirstUnavailableDay = isUnavailable && isPreviousDayAvailable;

    // Ensure it's a valid checkout only if within "maxStay" days of check-in
    const isWithinFiveDays =
      startDate &&
      differenceInDays(date, startDate) <= maxStay &&
      differenceInDays(date, startDate) > 0;
    const isValidCheckout = isFirstUnavailableDay && isWithinFiveDays;

    const dayClass = classNames({
      "react-datepicker__day--selected": isSelectedStart || isSelectedEnd,
      "react-datepicker__day--range-start": isSelectedStart,
      "react-datepicker__day--range-end": isSelectedEnd,
      "react-datepicker__day--in-range": isInRange,
      "react-datepicker__day--disabled":
        isPastDate ||
        (isUnavailable && !isValidCheckout) ||
        date > maxCheckinDate,
      "react-datepicker__day--unavailable":
        isUnavailable && !isValidCheckout && !isFirstUnavailableDay,
    });

    return (
      <div className={`react-datepicker__day ${dayClass} relative`}>
        <span className="max-md:text-xs">{day}</span>
        {showPrices &&
          price &&
          !isPastDate &&
          (!isUnavailable || isValidCheckout) && (
            <span className="text-[10px] md:text-xs font-light">{price}</span>
          )}
        {isUnavailable && !isValidCheckout && (
          <span className="text-error-text absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl">
            X
          </span>
        )}
      </div>
    );
  };

  // Handle date changes and enforce max stay
  const handleDateChange = (dates) => {
    const [start, end] = dates;

    if (start && end) {
      const stayDuration = differenceInDays(end, start);

      // Limit end date based on maxStay
      if (stayDuration > maxStay) {
        setEndDate(addDays(start, maxStay));
        setNightsCount(maxStay);
      } else {
        setEndDate(end);
        setNightsCount(stayDuration);
      }

      // Trigger revalidation after changing the dates
      const apiStartDate = format(start, "yyy-MM-dd");
      const apiEndDate = format(end, "yyy-MM-dd");
      mutate(
        `/api/beds24-calendar?startDate=${apiStartDate}&endDate=${apiEndDate}`
      );

      closeCalendarModal(); // Close modal after selecting dates
    } else {
      setStartDate(start);
      setEndDate(end);
      setNightsCount(0); // Reset nights count if no end date
    }
  };

  // Clear selected dates
  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
    setNightsCount(0);
  };

  // Handle search button click
  const handleSearchAction = () => {
    if (startDate && endDate) {
      if (startDate.getTime() === endDate.getTime()) {
        setIsDateValid(false);
        setIsDateSelected(true);
      } else {
        const searchData = {
          checkIn: format(startDate, "yyy-MM-dd"),
          checkOut: format(endDate, "yyy-MM-dd"),
          nightsCount,
        };
        setIsDateValid(true);
        setIsDateSelected(true);
        onSearch(searchData);
      }
    } else {
      setIsDateSelected(false);
      setIsDateValid(true);
    }
  };

  // Set modal container in DOM
  useEffect(() => {
    if (typeof window !== "undefined") {
      const appElement = document.getElementById("__next");
      if (appElement) {
        Modal.setAppElement(appElement);
      }
    }
  }, []);

  // Open calendar modal
  const openCalendarModal = () => {
    setIsCalendarModalOpen(true);
    setTimeout(() => setIsAnimating(true), 50);
  };

  // Close calendar modal
  const closeCalendarModal = () => {
    setIsAnimating(false);
    setTimeout(() => setIsCalendarModalOpen(false), 200);
  };

  // Handle responsive behavior for mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className=" w-full flex flex-col items-center justify-center px-4 pt-4 md:pt-8 pb-2">
      {isLoading && <Loading />}
      <div className="w-full flex justify-center">
        <div className="w-full flex justify-center">
          <div className="max-md:w-full flex flex-wrap justify-start md:justify-center max-[425px]:flex-col gap-4 min-[426px]:gap-8 p-4 border-[#2e377833] border rounded-md">
            {/* Calendar Icon + Check-in and Check-out Dates */}
            {!isMobile ? (
              <div
                className="flex max-[425px]:hidden items-center space-x-2  cursor-pointer text-dark-blue"
                onClick={openCalendarModal}
              >
                <MdOutlineCalendarMonth
                  className="text-accent-green"
                  size={22}
                />
                <span>{formattedStartDate}</span>
                <LiaLongArrowAltRightSolid
                  className="text-dark-blue"
                  size={22}
                />
                <span>{formattedEndDate}</span>
              </div>
            ) : (
              <Drawer>
                <DrawerTrigger className="flex flex-col min-[400px]:flex-row min-[400px]:items-center gap-2">
                  <div className="flex gap-2 items-center">
                    <MdOutlineCalendarMonth
                      className="text-accent-green"
                      size={22}
                    />
                    <span>{formattedStartDate}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <MdOutlineCalendarMonth
                      className="text-accent-green min-[400px]:hidden"
                      size={22}
                    />
                    <LiaLongArrowAltRightSolid
                      className="text-dark-blue max-[399px]:hidden"
                      size={22}
                    />
                    <span>{formattedEndDate}</span>
                  </div>
                </DrawerTrigger>
                <DrawerContent className=" h-[87svh] z-[99999]">
                  <DrawerHeader>
                    <DrawerTitle>
                      <h4>Select Dates</h4>
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="relative w-full h-full overflow-scroll border-t border-t-[#101838] border-b border-b-[#101838] border-opacity-20 ">
                    <DatePicker
                      locale="en-GB" // Set locale to start the week on Monday
                      selected={startDate}
                      onChange={handleDateChange} // Handle date changes
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      inline
                      monthsShown={isMobile ? totalMonths : 2}
                      minDate={new Date()} // Prevent selecting past dates
                      maxDate={maxCheckinDate} // Limit the latest date for check-in
                      renderDayContents={renderDayContents} // Display prices
                      filterDate={(date) => !isDateDisabled(date)} // Disable unavailable and past dates
                    />
                  </div>
                  <DrawerFooter>
                    <div className="relative w-full  mb-3 flex flex-col items-center z-[99999]">
                      {showPrices && (
                        <p className="text-center text-xs">{infoText}</p>
                      )}
                      {showPrices && (
                        <div className="w-full h-px bg-[#2e3778] bg-opacity-20 mt-4"></div>
                      )}
                      <div className="w-full flex justify-between items-end mt-1 ">
                        <div>
                          <p className="text-accent-green">
                            <span className="font-heavy">{nightsCount}</span>{" "}
                            {nightsCount === 1 ? "Night" : "Nights"} Selected
                          </p>
                          <div className="flex items-center gap-1 text-error-text">
                            <PiWarningCircle size={15} />
                            <p className="text-s">
                              Max. Stay{" "}
                              <span className="font-heavy">{maxStay}</span>{" "}
                              Nights
                            </p>
                          </div>
                          {showAgeLimitText && (
                            <div className="flex items-center gap-1 text-error-text">
                              <PiWarningCircle size={15} />
                              <p className="text-s">{ageLimitText}</p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={handleClearDates}
                          className="font-heavy transform active:scale-95"
                        >
                          CLEAR DATES
                        </button>
                      </div>
                    </div>
                    <DrawerClose asChild>
                      <Button className="bg-accent-green">Select Dates</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
            {/* Nights Icon + Nights Number */}
            <div className="flex items-center space-x-2 ">
              <IoMoonOutline className="text-accent-green" size={22} />
              <span>
                {nightsCount} {nightsCount === 1 ? "Night" : "Nights"}
              </span>
            </div>

            {/* Search button */}
            <button
              className="py-2 px-4 rounded-md bg-dark-blue text-white transform active:scale-95"
              onClick={handleSearchAction}
            >
              SEARCH
            </button>
          </div>

          {/* Modals */}
          <Modal
            isOpen={isCalendarModalOpen}
            onRequestClose={closeCalendarModal}
            ariaHideApp={false}
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${
              isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            overlayClassName="fixed inset-0 bg-[#000000bf] z-40 transition-opacity duration-200 ease-in-out z-[9999]"
          >
            <div className="bg-primary flex flex-col max-w-[99%] lg:min-w-[945px] max-h-[95vh] h-fit lg:h-[700px] overflow-hidden shadow-lg rounded outline-none focus:outline-none transition-all duration-200 ease-in-out px-4">
              <div className="w-full pt-4 mb-6 flex justify-end">
                <button onClick={closeCalendarModal}>
                  <IoClose size={25} />
                </button>
              </div>
              <div className="relative w-full h-full overflow-auto ">
                <DatePicker
                  locale="en-GB" // Set locale to start the week on Monday
                  selected={startDate}
                  onChange={handleDateChange} // Handle date changes
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  monthsShown={isMobile ? totalMonths : 2}
                  minDate={new Date()} // Prevent selecting past dates
                  maxDate={maxCheckinDate} // Limit the latest date for check-in
                  renderDayContents={renderDayContents} // Display prices
                  filterDate={(date) => !isDateDisabled(date)} // Disable unavailable and past dates
                />
              </div>
              <div className="relative w-full mt-4 md:mt-6 pb-4 md:px-8 flex flex-col items-center z-[99999]">
                {showPrices && <p className="text-center">{infoText}</p>}

                <div className="w-full flex justify-between items-end border-t border-t-[#2e3778] border-opacity-20 mt-4 pt-4">
                  <div>
                    <p className="text-accent-green">
                      <span className="font-heavy">{nightsCount}</span>{" "}
                      {nightsCount === 1 ? "Night" : "Nights"} Selected
                    </p>
                    <div className="flex items-center gap-1 text-error-text">
                      <PiWarningCircle size={15} />
                      <p className="text-s">
                        Max. Stay <span className="font-heavy">{maxStay}</span>{" "}
                        Nights
                      </p>
                    </div>
                    {showAgeLimitText && (
                      <div className="flex items-center gap-1 text-error-text">
                        <PiWarningCircle size={15} />
                        <p className="text-s">{ageLimitText}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleClearDates}
                    className="font-heavy transform active:scale-95"
                  >
                    CLEAR DATES
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>

      {/* Error messages */}
      <div className="relative w-full flex justify-center py-1">
        <p
          className={`absolute transition-all duration-300 ease-in-out transform text-error-text text-s text-center ${
            isDateValid
              ? "invisible opacity-0 translate-y-[-10px]"
              : "visible opacity-100 translate-y-0"
          }`}
        >
          Check-in and check-out dates cannot be the same
        </p>
        <p
          className={`absolute transition-all duration-300 ease-in-out transform text-error-text text-s text-center ${
            isDateSelected
              ? "invisible opacity-0 translate-y-[-10px]"
              : "visible opacity-100 translate-y-0"
          }`}
        >
          Please select both your check-in and check-out dates to proceed
        </p>
      </div>

      {isError && (
        <div>
          <p className="text-error-text text-center">
            Apologies, but we are currently experiencing technical difficulties.
            Please try again later or reach out to Hazeltree Lodge for
            assistance.
          </p>
        </div>
      )}
    </section>
  );
};

export default BookingSearchForm;
