/**
 * @file FaqsWrapper.js
 * @description Wrapper component for the FAQs page that fetches FAQ content and renders the FAQ section. Handles loading and error states during data fetching.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import { useFaqsContent } from "@/hooks/useFaqsContent";
import { FaqsPageComponent } from "@/components";

const FaqsWrapper = () => {
  // Fetch FAQ content using a custom hook
  const { content, isLoading, isError } = useFaqsContent();

  // Display loading or error content if necessary
  if (isLoading || isError) {
    return content;
  }

  // Access the referenced faqs
  const faqsRef = content?.faqsPageFaqsReference?.map((faq) => faq.fields);

  return (
    <div>
      {/* Render the FAQs page component and pass the FAQs data */}
      <FaqsPageComponent faqs={faqsRef} />
    </div>
  );
};

export default FaqsWrapper;
