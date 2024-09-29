/**
 * @file PaymentDetails.js
 * @description This component renders the payment form section of the checkout process, utilizing Stripe Elements for secure payment collection. It displays accepted card types and includes fields for cardholder name, card number, expiration date, and CVV. Validation errors are displayed in red.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import images from "@/utils/imageImports";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Select from "react-select";

/**
 * Custom styles for Stripe elements to enhance the appearance of the input fields.
 */
const cardStyle = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#d32f2f",
      iconColor: "#d32f2f",
      "::placeholder": {
        color: "#d32f2f",
      },
    },
  },
};

/**
 * PaymentDetails Component
 *
 * Renders the payment details form as part of the checkout process. Includes input fields for cardholder details, card number, expiration date, and CVV using Stripe Elements for secure payments.
 *
 * @param {object} form - Formik form object to handle validation and form state.
 * @returns {JSX.Element} The rendered PaymentDetails component.
 */
const PaymentDetails = ({ form }) => {
  return (
    <div className="w-full py-6">
      <h3 className="text-lg md:text-2xl font-bold mb-2">Payment Details</h3>
      <p>A 100% deposit is required to confirm your booking.</p>
      <p>
        Payment method: <strong>Stripe</strong>
      </p>

      {/* Accepted Cards Display */}
      <div className="flex justify-start items-start  flex-col  gap-3 mt-4 mb-2">
        <p>Stripe accepts most of credit and debit cards:</p>
        <div className="flex gap-3 justify-center items-center">
          <Image
            src={images.visa}
            alt="Visa"
            width={120}
            height={120}
            quality={100}
            className="w-[50px] h-auto"
          />
          <Image
            src={images.mastercard}
            alt="MasterCard"
            width={120}
            height={120}
            quality={100}
            className="w-[50px] h-auto"
          />
          <Image
            src={images.maestro}
            alt="Maestro"
            height={120}
            quality={100}
            className="w-[50px] h-auto"
          />
          <Image
            src={images.amex}
            alt="American Express"
            width={120}
            height={120}
            quality={100}
            className="w-[50px] h-auto"
          />
          <p>and more...</p>
        </div>
      </div>

      {/* Payment Form Fields */}
      <Form {...form} autoComplete="payment">
        <div className="flex sm:grid sm:grid-cols-2 max-sm:flex-col gap-4">
          {/* Cardholder Name Field */}
          <FormField
            control={form.control}
            name="cardName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Cardholder Name *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Name on card"
                    autoComplete="cc-name"
                    required
                    className={`focus:outline-none ${
                      fieldState.error ? "border-red-500" : ""
                    }`}
                    style={{ outline: "none", boxShadow: "none" }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />{" "}
                {/* Error message in red */}
              </FormItem>
            )}
          />

          {/* Card Number Field */}
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Card Number *</FormLabel>
                <FormControl>
                  <div
                    className={`px-3 py-2 h-10 text-sm rounded-md border border-input ${
                      fieldState.error ? "border-2 border-red-500" : ""
                    }`}
                  >
                    <CardNumberElement options={cardStyle} />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />{" "}
                {/* Error message in red */}
              </FormItem>
            )}
          />

          {/* Expiration Date Field */}
          <FormField
            control={form.control}
            name="cardExpiry"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Expiration Date *</FormLabel>
                <FormControl>
                  <div
                    className={`px-3 py-2 h-10 text-sm rounded-md border border-input ${
                      fieldState.error ? "border-2 border-red-500" : ""
                    }`}
                  >
                    <CardExpiryElement options={cardStyle} />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />{" "}
                {/* Error message in red */}
              </FormItem>
            )}
          />

          {/* CVV Field */}
          <FormField
            control={form.control}
            name="cardCvc"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>CVV *</FormLabel>
                <FormControl>
                  <div
                    className={`w-full items-center h-10 rounded-md border border-input ${
                      fieldState.error ? "border-red-500" : ""
                    } px-3 py-2 text-sm placeholder:text-muted-foreground focus-within:border-blue-500`}
                  >
                    <CardCvcElement options={cardStyle} />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
};

export default PaymentDetails;
