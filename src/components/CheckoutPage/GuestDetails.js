/**
 * @file GuestDetails.js
 * @description This component renders a form for guests to input their personal details during the checkout process. It includes fields for name, contact information, address, and additional information. The form integrates a country selector powered by react-select and handles validation using the form control props passed from the parent form.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Select from "react-select"; // Import react-select for country dropdown
import countryList from "react-select-country-list"; // Import country list

/**
 * GuestDetails Component
 *
 * Renders a form for guest details including title, name, contact information, address, and additional info like special requests. It also includes a country dropdown powered by react-select with custom styles.
 *
 * @param {object} form - Formik form object to handle validation and form state.
 * @returns {JSX.Element} The rendered GuestDetails component.
 */
const GuestDetails = ({ form }) => {
  // Get country options from react-select-country-list
  const countryOptions = countryList().getData();

  // Custom styles for react-select to integrate with your UI
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: "#D1D5DB",
      outline: "none",
      boxShadow: "none",
      "&active": {
        outline: "none",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1000, // Ensure the menu appears above other elements
    }),
  };

  return (
    <Form {...form}>
      <div className="space-y-4 md:space-y-6 w-full">
        {/* Guest Details */}
        <h3 className="text-lg md:text-2xl font-bold mb-2">Guest Details</h3>
        <div className="flex sm:grid sm:grid-cols-2 max-sm:flex-col gap-4">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Mr/Ms/Mrs"
                    autoComplete="honorific-prefix"
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

          {/* First Name Field */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your first name"
                    required
                    autoComplete="given-name"
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

          {/* Last Name Field */}
          <FormField
            control={form.control}
            name="lastName"
            autoComplete="family-name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your last name"
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

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    type="email"
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

          {/* Mobile Number Field */}
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Mobile Number *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your mobile number"
                    required
                    autoComplete="tel"
                    type="tel"
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

          {/* Telephone Number Field */}
          <FormField
            control={form.control}
            name="telephoneNumber"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Telephone Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your telephone number"
                    type="tel"
                    autoComplete="tel"
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

          {/* Address Field */}
          <FormField
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your address"
                    autoComplete="street-address"
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

          {/* City Field */}
          <FormField
            control={form.control}
            name="city"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your city"
                    autoComplete="address-level2"
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

          {/* Country Field with Dropdown */}
          <FormField
            control={form.control}
            name="country"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    options={countryOptions}
                    styles={customSelectStyles}
                    placeholder="Select your country"
                    autoComplete="country"
                    isClearable
                    onChange={(selectedOption) => {
                      form.setValue(
                        "country",
                        selectedOption ? selectedOption.value : ""
                      );
                    }}
                    value={
                      field.value
                        ? countryOptions.find(
                            (option) => option.value === field.value
                          )
                        : null
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-500" />{" "}
                {/* Error message in red */}
              </FormItem>
            )}
          />

          {/* Postcode Field */}
          <FormField
            control={form.control}
            name="postcode"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Postcode</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your postcode"
                    autoComplete="postal-code"
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
        </div>

        {/* Additional Info */}
        <h3 className="text-lg md:text-2xl font-bold mt-4 mb-2">
          Additional Info
        </h3>
        <FormField
          control={form.control}
          name="notes"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Notes (Special Requests)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Any special requests?"
                  autoComplete="off"
                  rows={3}
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
        <FormField
          control={form.control}
          name="arrivalTime"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Estimated Arrival Time</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., 15:00"
                  autoComplete="off"
                  type="time"
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
      </div>
    </Form>
  );
};

export default GuestDetails;
