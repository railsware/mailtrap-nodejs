import axios, { AxiosError } from "axios";

import MailtrapError from "./MailtrapError";

import { AxiosErrorObject } from "../types/axios";

/**
 * Axios error names guard.
 */
const hasErrorProperty = <T extends keyof AxiosErrorObject>(
  obj: unknown,
  propertyName: T
): obj is AxiosErrorObject => {
  return (obj as AxiosErrorObject)?.[propertyName] !== undefined;
};

/**
 * Formats a single error field into a readable string
 */
function formatErrorField([key, value]: [string, any]): string {
  return Array.isArray(value)
    ? `${key}: ${value.join(", ")}`
    : `${key}: ${value}`;
}

/**
 * Formats validation errors for a single item (e.g., contact import error)
 */
function formatValidationItem(item: any): string {
  const parts = [];
  if (item.email) parts.push(`Email: ${item.email}`);

  if (item.errors) {
    const errorParts = Object.entries(item.errors).map(formatErrorField);
    if (errorParts.length > 0) {
      parts.push(`Errors: ${errorParts.join("; ")}`);
    }
  }

  return parts.join(" - ");
}

/**
 * Formats an array of validation errors
 */
function formatValidationErrors(errors: any[]): string {
  return errors
    .map((item) =>
      typeof item === "object" && item !== null
        ? formatValidationItem(item)
        : String(item)
    )
    .join(" | ");
}

/**
 * Formats error messages from API response data
 */
function formatErrorMessage(data: any): string {
  if (!data || typeof data !== "object") {
    return String(data);
  }

  // Handle array of errors
  if (Array.isArray(data)) {
    return formatValidationErrors(data);
  }

  // Handle errors object with array of validation errors
  if (data.errors && Array.isArray(data.errors)) {
    return formatValidationErrors(data.errors);
  }

  // Handle errors object with name/base arrays
  if (data.errors && !Array.isArray(data.errors)) {
    const errorParts = [];
    if (
      hasErrorProperty(data.errors, "name") &&
      Array.isArray(data.errors.name)
    ) {
      errorParts.push(`Name errors: ${data.errors.name.join(", ")}`);
    }
    if (
      hasErrorProperty(data.errors, "base") &&
      Array.isArray(data.errors.base)
    ) {
      errorParts.push(`Base errors: ${data.errors.base.join(", ")}`);
    }
    if (errorParts.length > 0) {
      return errorParts.join("; ");
    }
  }

  // Handle simple error message
  if (data.error) {
    return String(data.error);
  }

  // Handle message field
  if (data.message) {
    return String(data.message);
  }

  // Fallback to JSON string for complex objects
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

/**
 * Error handler for axios response.
 */
export default function handleSendingError(error: AxiosError | unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const data = error.response?.data;

    let message = `Request failed with status ${status}`;

    // Add status text if available
    if (statusText) {
      message += ` (${statusText})`;
    }

    // Add API error details if available
    if (data) {
      const formattedError = formatErrorMessage(data);
      if (formattedError) {
        message += `: ${formattedError}`;
      }
    }

    // Add URL for context
    if (error.config?.url) {
      message += ` | URL: ${error.config.method?.toUpperCase()} ${
        error.config.url
      }`;
    }

    // @ts-expect-error weird typing around Error class, but it's tested to work
    throw new MailtrapError(message, { cause: error });
  }

  throw error; // should not happen, but otherwise rethrow error as is
}
