/**
 * @file ScrollToTop.js
 * @description ScrollToTop component that ensures the window scrolls to the top when the route changes in a Next.js application. Useful for maintaining user experience across page navigations.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
