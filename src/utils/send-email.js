/**
 * @file send-email.js
 * @description Utility to send emails using EmailJS. This module handles the email sending operation with provided data.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

const emailjs = require("emailjs-com");

/**
 * Sends an email using EmailJS.
 *
 * @param {Object} data - The data to be sent in the email.
 * @param {string} data.name - The sender's name.
 * @param {string} data.email - The sender's email address.
 * @param {string} data.phone - The sender's phone number (optional).
 * @param {string} data.subject - The subject of the email.
 * @param {string} data.message - The body of the email.
 *
 * @returns {Promise<Object>} - The result of the email sending operation.
 * @throws {Error} - If the email fails to send, an error is thrown.
 */
const sendEmail = async (data) => {
  try {
    // Send the email using EmailJS service
    const result = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID, // EmailJS Service ID
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, // EmailJS Template ID
      data, // Data to be included in the email
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY // EmailJS Public Key
    );

    return result; // Return the result on success
  } catch (error) {
    // Log the error and throw it to be handled by the calling function
    console.error(
      "Error sending email:",
      error?.text || error.message || error
    );
    throw new Error(error?.text || error.message || "Failed to send email");
  }
};

module.exports = sendEmail;
