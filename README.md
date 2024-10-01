# Hazeltree Lodge B&B Website

## Project Overview

The **Hazeltree Lodge** website serves as the primary platform for a Bed & Breakfast (B&B), offering key functionalities such as room browsing, booking, inquiries, and payments. This project ensures a smooth user experience with an integrated booking system, a CMS for easy content management, and secure payment processing.

You can view the live demo here: [Live Demo](https://www.hazeltreelodge.com)

## Tech Stack

This project is built using the following technologies:

- **Next.js (App Router)**: Version 14.2.5, built with JavaScript for both frontend and backend logic.
- **Stripe**: For secure payment processing.
- **Email.js**: For handling automated email responses.
- **Beds24**: Used to manage room availability, pricing, and bookings.
- **Contentful**: A CMS to easily update website content such as text, images and more.

## Installation and Setup

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Emanuele-Sgroi/hazeltree-lodge-website.git
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

- **Contentful CMS**: The CMS is custom-built for Hazeltree Lodge. To view or manage content, check the hooks in the code that are related to the CMS structure. If you prefer working with static content, you can disable API calls temporarily and substitute static content in the UI.

## Deployment

This project is optimized for deployment on **Vercel**. To deploy:

1. Connect the repository to your Vercel account.
2. Deploy directly through Vercel's deployment system.
3. No special configurations are needed for Vercel.

## License

This project is licensed under a custom MIT License. It allows non-commercial use, modification, and distribution, provided that proper attribution is given to the original developer, **Emanuele Sgroi** and conditions are met. For more details, see the `LICENSE` file.
