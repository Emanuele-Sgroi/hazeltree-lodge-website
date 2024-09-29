/**
 * @file FaqsPageComponent.js
 * @description This component displays the FAQ page with categorized questions and a smooth scroll functionality. It includes an accordion to toggle FAQ answers.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import { Header } from "@/components";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link as ScrollLink } from "react-scroll";

// Options to render rich text fields from Contentful
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

const FaqsPageComponent = ({ faqs }) => {
  // Extract unique categories from the FAQ list
  const categories = [...new Set(faqs.map((faq) => faq.category[0]))];

  return (
    <div className="relative w-full min-h-[80dvh] flex flex-col">
      <Header />
      {/* Top section with introduction and category links */}
      <div
        id="top"
        className="bg-secondary w-full min-h-80 flex flex-col text-center py-12 px-4"
      >
        <div className="md:hidden w-full h-[70px] md:h-20" />
        <div className="w-full h-full flex flex-col flex-grow justify-center items-center text-center">
          <h3 className="text-black uppercase text-6xl-smaller">
            Frequently Asked Questions
          </h3>
          <p className="font-light text-black mt-4 z-20">
            If you can&apos;t find the answer to your question, please{" "}
            <span className="text-accent-green underline underline-offset-4">
              <Link href={`/contact`}>get in touch</Link>
            </span>
            . We are happy to assist you.
          </p>
        </div>
        <p className="mt-8 md:mt-12 font-normal">Select a category</p>

        {/* Category selection */}
        <div className="w-full flex justify-center items-center flex-wrap gap-1 md:gap-2 mt-5">
          {categories.map((cat, index) => (
            <ScrollLink
              key={index}
              to={cat}
              smooth={true}
              duration={1000}
              offset={-90}
              className="px-2 md:px-4 py-1 md:py-2 bg-dark-blue md:hover:bg-[#367a35] rounded-3xl tracking-wider text-s text-white transition-all active:scale-[0.95] cursor-pointer"
            >
              {cat}
            </ScrollLink>
          ))}
        </div>
      </div>

      {/* FAQ accordion section */}
      <div className="w-full px-4 py-12 md:py-16 flex flex-col justify-center items-center">
        {categories.map((category, index) => (
          <div
            id={category}
            key={index}
            className={`w-full flex flex-col justify-center items-center ${
              index + 1 !== category.length ? "mb-12 md:mb-20" : ""
            }`}
          >
            <h3 className="text-4xl font-heavy mb-4 text-center">{category}</h3>
            <div className="w-full flex flex-col justify-center items-center">
              {faqs
                .filter((faq) => faq.category[0] === category)
                .map((faq, faqIndex) => (
                  <div
                    key={faqIndex}
                    className="w-full lg:w-[940px] bg-secondary"
                  >
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem
                        value={`faq ${faqIndex + 1}`}
                        className="w-full"
                      >
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
            <ScrollLink to="top" smooth={true} duration={1000}>
              <p className="mt-4 text-accent-green underline underline-offset-4 cursor-pointer">
                Back to top
              </p>
            </ScrollLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqsPageComponent;
