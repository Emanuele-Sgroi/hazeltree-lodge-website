/**
 * @file PrivacyPolicyWrapper.js
 * @description Renders the Privacy Policy page, fetching the content from Contentful and applying rich text rendering for the policy's structure and formatting. The page includes a header, the policy's title, effective date, and the privacy policy content. It also handles links, headings, lists, and rich text formatting like bold and italic text.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import { usePrivacyPolicyContent } from "@/hooks/usePrivacyPolicyContent";
import { Header } from "@/components";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";

/**
 * Rich text rendering options for Contentful content.
 * Defines how different types of rich text nodes should be rendered in React.
 * @type {Object}
 */
const options = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      const { uri } = node.data;
      if (
        uri.startsWith("mailto:") ||
        uri.startsWith("tel:") ||
        uri.startsWith("/breakfast-menu") ||
        uri.startsWith("http")
      ) {
        return (
          <a href={uri} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      }
      return <Link href={uri}>{children}</Link>;
    },
    [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
    [BLOCKS.HEADING_1]: (node, children) => (
      <h3 className="my-4">{children}</h3>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h3 className="my-4">{children}</h3>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="my-4">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <h3 className="text-xl my-4">{children}</h3>
    ),
    [BLOCKS.HEADING_5]: (node, children) => (
      <h3 className="text-lg my-4">{children}</h3>
    ),
    [BLOCKS.HEADING_6]: (node, children) => (
      <h3 className="text-base my-4">{children}</h3>
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
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4">
        {children}
      </blockquote>
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
 * PrivacyPolicyWrapper Component
 *
 * This component renders the privacy policy content for the website. It displays the header, the privacy policy title, effective date, and the privacy policy content retrieved from Contentful. It also uses the `documentToReactComponents` function to convert rich text into React components.
 *
 * @returns {JSX.Element} The rendered Privacy Policy page.
 */
const PrivacyPolicyWrapper = () => {
  const { content, isLoading, isError } = usePrivacyPolicyContent();

  // Handle loading or error states
  if (isLoading || isError) {
    return content;
  }

  return (
    <div className="relative w-full flex flex-col items-center">
      <Header />
      {/* Top section with title and effective date */}
      <div
        id="top"
        className="bg-secondary w-full min-h-80 flex flex-col text-center py-12 px-4"
      >
        <div className="md:hidden w-full h-[70px] md:h-20" />
        <div className="w-full h-full flex flex-col flex-grow justify-center items-center text-center">
          <h3 className="text-black uppercase text-6xl-smaller">
            {content.title}
          </h3>
          <p className="font-heavy text-black mt-4 z-20">Effective date:</p>
          <p className="font-light text-black mt-1 z-20">
            {content.effectiveDate}
          </p>
        </div>
      </div>

      {/* Privacy policy content */}
      <div className="w-full min-[980px]:max-w-[940px] h-full flex flex-col justify-center items-center my-4 min-[980px]:my-12 pb-4 px-4 min-[980px]:px-8 border-l-2 border-r-2 border-solid border-[#2e377a14]">
        <span>
          {typeof content.privacyPolicyContent === "string"
            ? content.privacyPolicyContent
            : documentToReactComponents(content.privacyPolicyContent, options)}
        </span>
      </div>
    </div>
  );
};

export default PrivacyPolicyWrapper;
