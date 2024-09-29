/**
 * @file ButtonPrimarySubmit.js
 * @description ButtonPrimarySubmit component renders a primary styled submit button with an optional arrow icon. This button is used for form submissions and supports a disabled state.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

/**
 * ButtonPrimarySubmit Component
 *
 * Renders a submit button for forms with an optional arrow icon and disabled state.
 *
 * @param {string} text - The text to display on the button.
 * @param {boolean} disabled - Optional. If true, disables the button.
 *
 * @returns {JSX.Element} The rendered ButtonPrimarySubmit component.
 */
const ButtonPrimarySubmit = ({ text, disabled }) => {
  return (
    <button
      type="submit"
      disabled={disabled && true}
      className={` ${
        disabled ? "btn_primary_disabled" : "btn_primary"
      } btn_green`}
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

export default ButtonPrimarySubmit;
