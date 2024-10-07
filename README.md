# Hazeltree Lodge B&B Website

## Project Overview

This is the main repository for hazeltree Lodge website.

## Tech Stack

This project is built using the following technologies:

- **Next.js (App Router)**: Version 14.2.5, built with JavaScript for both frontend and backend logic.
- **Stripe**: For secure payment processing.
- **Email.js**: For handling automated email responses.
- **Beds24**: Used to manage room availability, pricing, and bookings.
- **Contentful**: A CMS to easily update website content such as text, images and more.

Note: You can only clone this repository if you grantet access.

## Installation and Setup

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone [https://github.com/Emanuele-Sgroi/hazeltree-lodge-website.git](https://github.com/Emanuele-Sgroi/Hazeltree-Lodge.git)
   ```

2. **Navigate to the project directory**:

   ```bash
   cd hazeltreelodge
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Create an `.env.local` or `.env.production` file** in the root directory and add the required API keys and environment variables. Below is an example of what the `.env` file should contain:

   ```env
   CONTENTFUL_SPACE_ID=xxxxxxxxxx
   CONTENTFUL_ACCESS_TOKEN=xxxxxxxxxxx
   CONTENTFUL_PREVIEW_TOKEN=xxxxxxxxxxx

   NEXT_PUBLIC_EMAILJS_SERVICE_ID=xxxxxxxxxx
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=xxxxxxxxxx
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxx

   NEXT_PUBLIC_BEDS24_REFRESH_TOKEN=xxxxxxxxxxxxxxxxx

   NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY=xxxxxxxxxxxxxxxxxxxxx
   STRIPE_TEST_SECRET_KEY=xxxxxxxxxxxxxxx

   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxxxxxxxxxxxx
   STRIPE_SECRET_KEY=xxxxxxxxxxxx

   SITE_URL=your URL
   ```

## Usage

To use the project:

- After setting up the `.env` file with the correct API keys and configurations, run the following command to start the project locally:

  ```bash
  npm run dev
  ```
