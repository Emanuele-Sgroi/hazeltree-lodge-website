/**
 * @file CheckoutForm.js
 * @description This component renders the checkout form where users can enter their guest details and payment information to finalize a booking. It handles validation using react-hook-form and Zod for schema validation, integrates with Stripe for payment processing, and updates the booking status upon successful payment. The form is divided into guest details and payment sections, and it triggers booking confirmation after payment is completed.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import {
  ButtonPrimarySubmit,
  GuestDetails,
  PaymentDetails,
} from "@/components";
import Image from "next/image";
import { useBooking } from "@/hooks/useBooking";
import Link from "next/link";
import { useLoading } from "@/context/LoadingContext";

// Define the Zod schema with validations
const checkoutFormSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  mobileNumber: z.string().min(1, { message: "Mobile number is required" }),
  telephoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
  notes: z.string().optional(),
  arrivalTime: z.string().optional(),
  cardName: z.string().min(1, { message: "Cardholder name is required" }),
  cardNumber: z.string(),
  cardExpiry: z.string(),
  cardCVV: z.string(),
});

/**
 * CheckoutForm Component
 *
 * Handles guest and payment details, processes Stripe payments, and updates booking data upon successful payment.
 *
 * @param {number} totalPrice - Total price of the booking
 * @param {object} bookingData - The current booking data from sessionStorage
 * @param {string} sessionId - The session ID for the checkout process
 * @returns {JSX.Element} The rendered CheckoutForm component
 */
const CheckoutForm = ({
  totalPrice,
  bookingData,
  sessionId,
  setBookingComplete,
  setIsSubmittingPayment,
}) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isCheckingError, setIsCheckingError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { createBooking, updateBooking, isLoading, error } = useBooking();
  //const { setBookingDetails } = useBookingContext();
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  const form = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      telephoneNumber: "",
      address: "",
      city: "",
      country: "",
      postcode: "",
      notes: "",
      arrivalTime: "",
      totalPrice: 0,
      arrival: "",
      departure: "",
      numberOfAdults: 1, // Default to 1 adult
      numberOfChildren: 0, // Default to 0 children
      roomIds: [], // Initialize as empty array
      cardName: "",
      cardNumber: "",
      cardExpiry: "",
      cardCVV: "",
    },
  });

  /**
   * Effect to handle safe payment requests
   */
  useEffect(() => {
    if (!totalPrice) return;

    // Create PaymentIntent on component mount
    async function createIntent() {
      const totalPriceInCents = Math.round(totalPrice * 100);
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPriceInCents,
          sessionId, // pass unique session ID
          bookingIds: bookingData.bookingIds,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPaymentIntentId(data.paymentIntentId);
      } else {
        console.log("error while calling payment intent");
      }
    }
    createIntent();
  }, [totalPrice, sessionId]);

  /**
   * Generate invoice number with today's date
   * @param {object} values - Invoice number
   */
  function generateInvoiceNumber() {
    // Simple example using timestamp
    return `INV-${Date.now()}`;
  }

  /**
   * Handle form submission and payment processing
   * @param {object} values - Form values submitted by the user
   */
  const handleSubmit = async (values) => {
    setIsSubmittingPayment(true);
    if (!stripe || !elements) {
      return;
    }

    if (!paymentIntentId) {
      // If paymentIntentId still isn't set, handle it gracefully
      console.error("paymentIntentId not ready yet");
      return;
    }

    setIsCheckingIn(true);
    setIsCheckingError(false);
    setErrorMessage("");

    try {
      // Create a PaymentMethod from the card element
      const { paymentMethod, error: pmError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: `${values.firstName} ${values.lastName}`,
          },
        });

      if (pmError) {
        setIsCheckingError(true);
        setErrorMessage(pmError.message);
        setIsCheckingIn(false);
        return;
      }

      //  Confirm the PaymentIntent on the server
      const confirmRes = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          paymentMethodId: paymentMethod.id,
          bookingData,
          sessionId,
          guestValues: values,
        }),
      });

      const confirmData = await confirmRes.json();
      if (!confirmRes.ok || !confirmData.success) {
        setIsCheckingError(true);
        setErrorMessage(confirmData.error || "Payment confirmation failed");
        setIsCheckingIn(false);
        return;
      }

      //  If server says "payment succeeded", we proceed with existing Beds24 code
      //    The server route returns paymentIntentId so we can store or log it.
      const returnedPaymentIntentId =
        confirmData.paymentIntentId || "UNKNOWN_ID";

      // ==============================
      // BEDS24: EXISTING CODE UNCHANGED
      // ==============================
      // (We leave your code that updates Beds24, sets the status to "confirmed", etc.)
      // Just as you had it:

      if (bookingData?.bookingIds && bookingData.bookingIds.length > 0) {
        const totalGuestsNote = `Total Guests: ${bookingData.totalGuestsNumber}`;

        const bookingUpdates = bookingData.bookingIds.map(
          (bookingId, index) => {
            if (index === 0) {
              // Primary Booking
              const addNote =
                bookingData.bookingIds.length > 1
                  ? `Payment of €${totalPrice} covers multiple rooms. Booking IDs: ${bookingData.bookingIds.join(
                      ", "
                    )}. ${totalGuestsNote}. Paid with Stripe: ${returnedPaymentIntentId}`
                  : `Paid with Stripe: ${returnedPaymentIntentId}`;

              const addInvoiceDescription =
                bookingData.bookingIds.length > 1
                  ? "Charges for Multiple Rooms"
                  : "Room Charges";

              const invoiceNumber = generateInvoiceNumber(); // define or import this
              const invoiceDate = new Date().toISOString().split("T")[0];

              return {
                id: bookingId,
                status: "confirmed",
                arrival: bookingData.checkIn,
                departure: bookingData.checkOut,
                numAdult: bookingData.selectedRooms[index].guestCount,
                numChild: 0,
                title: values.title,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                mobile: values.mobileNumber,
                address: values.address,
                city: values.city,
                postcode: values.postcode,
                country2: values.country,
                comments: values.notes,
                arrivalTime: values.arrivalTime,
                flagColor: "0000ff",
                flagText: "Paid",
                notes: addNote,
                price: totalPrice,
                deposit: totalPrice,
                offerId: 1,
                allowAutoAction: "enable",
                actions: {
                  makeGroup: true,
                  notifyHost: true,
                  assignInvoiceNumber: true,
                },
                invoice: {
                  invoiceId: invoiceNumber,
                  invoiceDate: invoiceDate,
                },
                invoiceItems: [
                  {
                    type: "charge",
                    description: addInvoiceDescription,
                    qty: 1,
                    amount: totalPrice,
                  },
                  {
                    type: "payment",
                    description: "Paid via stripe",
                    amount: totalPrice,
                  },
                ],
              };
            } else if (bookingData.bookingIds.length > 1 && index !== 0) {
              // Secondary Bookings
              const totalGuestsNote = `Total Guests: ${bookingData.totalGuestsNumber}`;
              const addNote =
                bookingData.bookingIds.length > 1
                  ? `Payment recorded under Booking ID ${bookingData.bookingIds[0]}. Paid with Stripe: ${returnedPaymentIntentId}. ${totalGuestsNote}`
                  : `Paid with Stripe: ${returnedPaymentIntentId}`;

              return {
                id: bookingId,
                status: "confirmed",
                arrival: bookingData.checkIn,
                departure: bookingData.checkOut,
                numAdult: bookingData.selectedRooms[index].guestCount,
                numChild: 0,
                title: values.title,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                mobile: values.mobileNumber,
                address: values.address,
                city: values.city,
                postcode: values.postcode,
                country2: values.country,
                comments: values.notes,
                arrivalTime: values.arrivalTime,
                flagColor: "0000ff",
                flagText: "Paid",
                notes: addNote,
                price: 0,
                deposit: 0,
                allowAutoAction: "disable",
                actions: {
                  makeGroup: true,
                },
              };
            }
          }
        );

        const updateSuccess = await updateBooking(bookingUpdates);

        const updatedData = {
          bookingIds: bookingData.bookingIds,
          arrival: bookingData.checkIn,
          departure: bookingData.checkOut,
          numAdult: bookingData.totalGuestsNumber,
          numChild: 0,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          mobile: values.mobileNumber,
          amount: totalPrice,
          status: "Confirmed",
        };

        if (updateSuccess) {
          sessionStorage.setItem(
            `checkout_${sessionId}`,
            JSON.stringify(updatedData)
          );

          // router.replace(`/booking/confirmation/${sessionId}`);
          handleSendUserToConfirmationPage(sessionId);
        } else {
          setIsCheckingError(true);
          setErrorMessage("Something went wrong.");
        }
      }
      // ============== END BEDS24 CODE ==============
    } catch (error) {
      setIsCheckingError(true);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  /**
   * Handle send user to confirmation page
   * @param {object} values - Form values submitted by the user
   */
  const handleSendUserToConfirmationPage = (sessionId) => {
    setIsRedirecting(true);
    setBookingComplete(true);
    router.replace(`/booking/confirmation/${sessionId}`);
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <GuestDetails form={form} />
        <PaymentDetails form={form} />
        <div className="flex flex-col items-center justify-center py-2 px-4">
          <p className="text-s mb-4 text-center">
            By clicking &quot;Finish and Pay&quot; you agree to our{" "}
            <span>
              <Link
                href={`/terms-and-conditions`}
                target="_blank"
                className="text-accent-green underline underline-offset-4 mt-2"
              >
                Terms & Conditions
              </Link>
            </span>
          </p>
          <ButtonPrimarySubmit
            text={`FINISH AND PAY`}
            disabled={isCheckingIn}
          />
          {(isCheckingIn || isLoading) && (
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
          {(isCheckingError || error) && (
            <div className="flex flex-col justify-center items-center gap-2 mt-2">
              <p className="text-error-text">{errorMessage}</p>
            </div>
          )}
        </div>
      </form>

      {isRedirecting && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999999999999]">
          <Image
            src="/images/icons/spinner-white.png"
            alt="Please wait"
            width={40}
            height={40}
            quality={100}
            className="animate-spin"
          />
        </div>
      )}
    </>
  );
};

export default CheckoutForm;
