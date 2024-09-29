/**
 * @file layout.js
 * @description Defines the global layout structure for the website, including providers and common components like Navbar and Footer.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import { SiteContentProvider } from "@/context/SiteContentContext";
import { LoadingProvider } from "@/context/LoadingContext";
import Loading from "@/components/Loading/Loading";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import { BookingProvider } from "@/context/BookingContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hazeltree Lodge | A Home Away From Home",
  description:
    "Discover Hazeltree Lodge, a charming Bed & Breakfast in Altans, Co. Sligo. Enjoy our cozy accommodations with three well-appointed rooms, perfect for exploring local attractions like surfing and golf or simply relaxing in a friendly, welcoming environment.",
  icons: {
    icon: "/favicon.ico", // Standard favicon
    shortcut: "/favicon.ico", // Shortcut icon
    apple: "/apple-icon.png", // Apple devices
    android: "/android-icon.png", // Android devices
  },
  openGraph: {
    title: "Hazeltree Lodge | A Home Away From Home",
    description:
      "Discover Hazeltree Lodge, a charming Bed & Breakfast in Altans, Co. Sligo. Enjoy our cozy accommodations with three well-appointed rooms, perfect for exploring local attractions like surfing and golf or simply relaxing in a friendly, welcoming environment.",
    url: "https://www.hazeltreelodge.com",
    siteName: "Hazeltree Lodge",
    images: [
      {
        url: "https://www.hazeltreelodge.com/images/og-image.jpg",
        width: 1200,
        height: 451,
        alt: "Hazeltree Lodge - Bed & Breakfast in Altans, Co. Sligo",
      },
    ],
    type: "website",
  },
};

/**
 * RootLayout Component
 *
 * Wraps all pages with global providers and common components to ensure consistent layout and functionality.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {JSX.Element} The rendered RootLayout component.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ErrorBoundary catches and handles errors within the application */}
        <ErrorBoundary>
          {/* LoadingProvider manages the global loading state */}
          <LoadingProvider>
            {/* SiteContentProvider supplies site-wide content context */}
            <SiteContentProvider>
              {/* BookingProvider manages booking-related state and logic */}
              <BookingProvider>
                {/* Displays a global loading indicator */}
                <Loading />
                {/* Renders the navigation bar */}
                <Navbar />
                {/* Enables smooth scrolling to the top of the page */}
                <ScrollToTop />
                {/* Renders the main content of the page */}
                {children}
                {/* Renders the footer section */}
                <Footer />
              </BookingProvider>
            </SiteContentProvider>
          </LoadingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
