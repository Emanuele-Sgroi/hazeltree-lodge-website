/**
 * @file ButtonPrimary.js
 * @description ButtonPrimary component renders a primary styled button with an optional arrow icon. It supports both link-based and click event-based actions. The button can be styled in green or beige, and can be disabled when necessary.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import Link from "next/link";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

/**
 * ButtonPrimary Component
 *
 * Renders a primary styled button with optional arrow icon and link support.
 *
 * @param {string} text - The text to display on the button.
 * @param {boolean} isBeige - Determines button color (beige or green).
 * @param {string} href - Optional. If provided, the button will act as a link.
 * @param {function} onClick - Optional. Function to trigger on button click.
 * @param {boolean} disabled - Optional. If true, disables the button.
 *
 * @returns {JSX.Element} The rendered ButtonPrimary component.
 */
const ButtonPrimary = ({ text, isBeige, href, onClick, disabled }) => {
  if (href) {
    return (
      <Link href={href}>
        <button
          className={`btn_primary ${isBeige ? "btn_beige" : "btn_green"}`}
        >
          <p className="btn_primary_text">{text.toUpperCase()}</p>
          <LiaLongArrowAltRightSolid className="btn_arrow" />
        </button>
      </Link>
    );
  }

  return (
    <button
      className={`${disabled ? "btn_primary_disabled" : "btn_primary"}  ${
        isBeige ? "btn_beige" : "btn_green"
      }`}
      onClick={onClick}
      disabled={disabled && true}
    >
      <p
        className={`${
          disabled ? "btn_primary_text_disabled" : "btn_primary_text"
        }`}
      >
        {text.toUpperCase()}
      </p>
      <LiaLongArrowAltRightSolid
        className={`${disabled ? "btn_arrow_disabled" : "btn_arrow"}`}
      />
    </button>
  );
};

export default ButtonPrimary;
