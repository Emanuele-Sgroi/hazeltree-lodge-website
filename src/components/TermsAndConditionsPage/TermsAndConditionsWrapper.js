/**
 * @file TermsAndConditionsWrapper.js
 * @description Renders the Terms and Conditions page. This page includes an accordion structure to display each term and condition section, and offers links to contact or FAQ pages for further clarification.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import { useTermsContent } from "@/hooks/useTermsContent";
import { Header } from "@/components";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Rich text rendering options for Contentful content
const options = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      const { uri } = node.data;
      if (uri.startsWith("/breakfast-menu") || uri.startsWith("http")) {
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
      } else if (uri.startsWith("mailto:") || uri.startsWith("tel:")) {
        return (
          <a href={uri} target="_blank" rel="noopener noreferrer">
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
    [BLOCKS.PARAGRAPH]: (node, children) => <p className="mt-3">{children}</p>,
    [BLOCKS.HEADING_4]: (node, children) => (
      <h3 className="text-lg my-3">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="list-disc pl-6 min-[980px]:pl-8">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="list-decimal pl-8">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <li className="my-2">{children}</li>
    ),
  },
  renderMark: {
    [MARKS.BOLD]: (text) => <span className="font-heavy">{text}</span>,
    [MARKS.ITALIC]: (text) => <span className="italic">{text}</span>,
    [MARKS.UNDERLINE]: (text) => (
      <span className="underline underline-offset-2">{text}</span>
    ),
  },
};

/**
 * TermsAndConditionsWrapper Component
 *
 * Renders the Terms and Conditions page content including the header, accordion structure for each term, and links to contact or FAQ pages for user inquiries.
 *
 * @returns {JSX.Element} The rendered Terms and Conditions page.
 */
const TermsAndConditionsWrapper = () => {
  const { content, isLoading, isError } = useTermsContent();

  // Handle loading or error states
  if (isLoading || isError) {
    return content;
  }

  // Extract referenced terms and conditions from content
  const termsRef = content?.termsAndConditionsReference?.map(
    (term) => term.fields
  );

  return (
    <div className="relative w-full flex flex-col items-center">
      <Header />
      {/* Top section with title, update date, and intro text */}
      <div
        id="top"
        className="bg-secondary w-full min-h-80 flex flex-col text-center py-12 px-4"
      >
        <div className="md:hidden w-full h-[70px] md:h-20" />
        <div className="w-full h-full flex flex-col flex-grow justify-center items-center text-center">
          <h3 className="text-black uppercase text-6xl-smaller">
            {content.title.toUpperCase()}
          </h3>
          <p className="font-light text-black mt-4 z-20">
            If you have any questions about our Terms and Conditions, please{" "}
            <span className="text-accent-green underline underline-offset-4">
              <Link href={`/contact`}>contact us</Link>
            </span>
            . You may also find answers on our{" "}
            <span className="text-accent-green underline underline-offset-4">
              <Link href={`/faqs`}>FAQs</Link>
            </span>{" "}
            page.
          </p>
          <p className="font-heavy text-black mt-6 z-20">Last Update:</p>
          <p className="font-light text-black mt-1 z-20">
            {content.dateUpdate}
          </p>
        </div>
      </div>

      {/* Terms and conditions content */}
      <div className="w-full flex flex-col justify-center items-center py-12 px-4">
        {termsRef.map((term, index) => (
          <div key={index} className="w-full lg:w-[940px] bg-secondary">
            <Accordion
              defaultValue={index === 0 && term.title}
              type="single"
              collapsible
              className="w-full"
            >
              <AccordionItem value={term.title} className="w-full">
                <AccordionTrigger className="text-[15px] sm:text-lg font-heavy text-left px-4 border-dark-blue border-l-[10px] border-solid shadow-[inset_0_-0.5px_0px_0px_rgba(46,55,120,1)]">
                  {term.title}
                </AccordionTrigger>
                <AccordionContent className="w-full pl-7 pr-4 pt-4 pb-8">
                  {typeof term.text === "string"
                    ? term.text
                    : documentToReactComponents(term.text, options)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsAndConditionsWrapper;
