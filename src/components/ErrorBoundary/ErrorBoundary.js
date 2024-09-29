/**
 * @file ErrorBoundary.js
 * @description A component that catches JavaScript errors in any child component tree and displays a fallback UI. It logs errors and prevents the entire application from crashing due to unhandled errors in specific parts of the UI.
 * @author
 * Emanuele Sgroi
 * @date 20 August 2024
 */

"use client";

import React from "react";
import ErrorComponent from "../ErrorComponent/ErrorComponent";

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in the child component tree, logs those errors,
 * and displays a fallback UI instead of crashing the application.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false }; // Track whether an error has been caught
  }

  /**
   * @function getDerivedStateFromError
   * React lifecycle method that updates the state when an error is caught.
   * @param {Error} error - The error thrown in any child component.
   * @returns {object} - Updates `hasError` state to true.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * @function componentDidCatch
   * React lifecycle method for handling errors that are thrown within the component tree.
   * This is where you can log errors to an external service for monitoring.
   * @param {Error} error - The error thrown in any child component.
   * @param {object} errorInfo - Information about where the error occurred.
   */
  componentDidCatch(error, errorInfo) {
    // log error
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  /**
   * @function render
   * Displays the fallback UI if an error has been caught, otherwise renders the children.
   */
  render() {
    if (this.state.hasError) {
      // render fallback UI if an error has occurred
      return <ErrorComponent />;
    }
    // Otherwise, render the children components
    return this.props.children;
  }
}

export default ErrorBoundary;
