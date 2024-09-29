/**
 * @file ContactSection.js
 * @description Contact section component displaying contact details and a form for users to send a message. The form validates user input using React Hook Form and Zod, and the sendEmail function is used to handle the submission process.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
} from "react-icons/fa";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import sendEmail from "@/utils/send-email";

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

/**
 * ContactSection Component
 * Displays contact details such as phone, email, address, and a form for users to send a message.
 * Handles form submission, validation, and success/error states.
 */
const ContactSection = ({
  smallTitle,
  mainTitle,
  description,
  phonePrefix,
  phoneNumber,
  emailAddress,
  addressMapLink,
  address,
  facebook,
}) => {
  // State management for loading, error, and success messages
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize the form with React Hook Form and Zod for validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // Function to handle form submission
  const onSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Call the sendEmail function from utils to send the form data
      const result = await sendEmail(values);

      if (result.status === 200) {
        setSuccessMessage("Your message has been sent successfully!");
        form.reset(); // Clear form fields on success
      } else {
        throw new Error("Failed to send your message. Please try again.");
      }
    } catch (error) {
      // Handle errors during email sending
      setErrorMessage(
        error.message || "Failed to send your message. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-col md:flex-row justify-center px-6 md:px-8 py-12 md:py-16 lg:py-20 gap-10 lg:gap-8 xl:gap-20">
      {/* Static contact section */}
      <div className="w-full md:w-1/2 flex justify-end">
        <div className="flex flex-col relative w-full max-w-full md:max-w-lg text-left gap-4 lg:gap-6">
          <div className="relative flex justify-start lg:justify-start items-center gap-3 z-20">
            <span className="line-h6"></span>
            <h6>{smallTitle?.toUpperCase()}</h6>
          </div>
          <h2 className="relative z-20">{mainTitle}</h2>
          <p>{description}</p>
          <p>
            Looking for quick answers? Visit our{" "}
            <span className="text-accent-green underline underline-offset-4">
              <Link href={`/faqs`}>FAQ page</Link>
            </span>{" "}
            for more information.
          </p>
          {/* Contact details */}
          <div className="flex flex-col gap-2">
            <Link
              href={`tel:${phonePrefix}${phoneNumber}`}
              target="_blank"
              className="group/item flex items-start gap-1 lg:gap-2 w-fit"
            >
              <FaPhoneAlt size={20} className="text-accent-green" />
              <p className="group-hover/item:underline underline-offset-4">
                {phonePrefix}&nbsp;&nbsp;
                {phoneNumber}
              </p>
            </Link>
            <Link
              href={`mailto:${emailAddress}`}
              target="_blank"
              className="group/item flex items-start gap-1 lg:gap-2 w-fit"
            >
              <FaEnvelope size={20} className="text-accent-green" />
              <p className="group-hover/item:underline underline-offset-4">
                {emailAddress}
              </p>
            </Link>
            <Link
              href={addressMapLink}
              target="_blank"
              className="group/item flex items-start gap-1 lg:gap-2 w-fit"
            >
              <FaMapMarkerAlt size={20} className="text-accent-green" />
              <p className="flex flex-col group-hover/item:underline underline-offset-4">
                {address.split("\n").map((line, index) => (
                  <span key={index} className="relative z-20">
                    {line}
                  </span>
                ))}
              </p>
            </Link>
          </div>
          <Link
            href={facebook}
            target="_blank"
            className="flex gap-3 items-center justify-start"
          >
            <p className="text-[18px] md:text-xl font-light">Follow us</p>
            <FaFacebook color="#2e3778" size={25} />
          </Link>
        </div>
      </div>

      {/* Contact form section */}
      <div className="w-full md:w-1/2">
        <div className="relative flex justify-start lg:justify-start items-center gap-3 z-20 mb-6">
          <span className="line-h6"></span>
          <h6>SEND A MESSAGE</h6>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full xl:w-[85%]"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Name<span className="text-error-text">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        {...field}
                        className="focus:outline-none"
                        style={{ outline: "none", boxShadow: "none" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Email<span className="text-error-text">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your email"
                        {...field}
                        className="focus:outline-none"
                        style={{ outline: "none", boxShadow: "none" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Your phone (optional)"
                        {...field}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        className="focus:outline-none"
                        style={{ outline: "none", boxShadow: "none" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Subject<span className="text-error-text">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Subject"
                        {...field}
                        className="focus:outline-none"
                        style={{ outline: "none", boxShadow: "none" }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Message<span className="text-error-text">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your message"
                      {...field}
                      rows={5}
                      className="focus:outline-none"
                      style={{ outline: "none", boxShadow: "none" }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className=" bg-accent-green">
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Form>

        {/* Success and Error Messages */}
        {successMessage && (
          <p className="text-sm text-accent-green mt-4">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-sm text-error-text mt-4">{errorMessage}</p>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
