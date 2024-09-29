/**
 * @file ButtonSecondary.js
 * @description ButtonSecondary component renders a secondary styled button with an arrow icon, primarily used as a link button for navigation. This button is used to guide users to other sections or pages within the application.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

import React from "react";
import Link from "next/link";
import { LiaLongArrowAltRightSolid } from "react-icons/lia";

/**
 * ButtonSecondary Component
 *
 * Renders a secondary styled button with an arrow icon for navigation purposes.
 *
 * @param {string} text - The text to display on the button.
 * @param {string} href - The URL the button should navigate to.
 *
 * @returns {JSX.Element} The rendered ButtonSecondary component.
 */

const ButtonSecondary = ({ text, href }) => {
  return (
    <Link href={href}>
      <button className={`btn_secondary`}>
        <p className="btn_secondary_text">{text.toUpperCase()}</p>
        <LiaLongArrowAltRightSolid className="btn_secondary_arrow" />
        <span className="btn_secondary_solid" />
      </button>
    </Link>
  );
};

export default ButtonSecondary;
