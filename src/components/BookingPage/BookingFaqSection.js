/**
 * @file BookingFaqSection.js
 * @description The BookingFaqSection component renders a FAQ section for the booking page. It displays frequently asked questions with an accordion-style interface, leveraging Contentful rich text fields and dynamic link handling. The section is styled for consistency with the overall design of the Hazeltree Lodge website.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client"; // This is a client-side component

import React from "react";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Options to render rich text fields from Contentful.
 * Handles different block types and inline elements, including hyperlinks.
 */
const options = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      const { uri } = node.data;
      // Open external links, mailto, tel, and internal links differently
      if (
        uri.startsWith("mailto:") ||
        uri.startsWith("tel:") ||
        uri.startsWith("/breakfast-menu") ||
        uri.startsWith("http")
      ) {
        return (
          <a
            href={uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-green underline underline-offset-4"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={uri}
          className="text-accent-green underline underline-offset-4"
        >
          {children}
        </Link>
      );
    },
    [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc pl-6">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="list-[circle] pl-12 -mt-2">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li className="my-2">{children}</li>
    ),
  },
};

/**
 * BookingFaqSection Component
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.smallTitle - The small title displayed at the top of the section.
 * @param {string} props.mainTitle - The main title for the FAQ section.
 * @param {Array} props.faqsRef - An array of FAQs fetched from the CMS, containing question and answer fields.
 *
 * @returns {JSX.Element} The rendered BookingFaqSection component.
 */
const BookingFaqSection = ({ smallTitle, mainTitle, faqsRef }) => {
  return (
    <section className="bg-secondary w-full flex flex-col items-center justify-center px-4 py-8 md:py-12 lg:py-16">
      {/* Title and Subtitle */}
      <div className="flex flex-col justify-center items-center gap-2 max-w-[770px]">
        <div className="flex justify-center items-center gap-3">
          <span className="line-h6"></span>
          <h6 className="text-center">{smallTitle.toUpperCase()}</h6>
          <span className="line-h6"></span>
        </div>
        <h2 className="text-center">{mainTitle}</h2>
      </div>
      {/* Faqs display */}
      <div className="w-full flex flex-col items-center mt-8 md:mt-12 lg:mt-16">
        {faqsRef.map((faq, faqIndex) => (
          <div key={faqIndex} className="w-full lg:w-[940px] bg-secondary">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={`faq ${faqIndex + 1}`} className="w-full">
                <AccordionTrigger className="text-[15px] sm:text-lg font-heavy text-left px-4 border-dark-blue border-l-[10px] border-solid shadow-[inset_0_-0.5px_0px_0px_rgba(46,55,120,1)]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="w-full pl-7 pr-4 pt-4 pb-6">
                  {typeof faq.answer === "string"
                    ? faq.answer
                    : documentToReactComponents(faq.answer, options)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>

      <p className="mt-8 md:mt-12 lg:mt-16 text-center">
        Need more answers? Check our{" "}
        <span className="text-accent-green underline underline-offset-4">
          <Link href={`/faqs`}>FAQ page</Link>
        </span>{" "}
        or{" "}
        <span className="text-accent-green underline underline-offset-4">
          <Link href={`/contact`}>contact us</Link>
        </span>{" "}
        directly.
      </p>
    </section>
  );
};

export default BookingFaqSection;
