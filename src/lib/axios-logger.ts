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
 * Error handler for axios response.
 */
export default function handleSendingError(error: AxiosError | unknown) {
  if (axios.isAxiosError(error)) {
    const serverErrorsObject =
      error.response?.data &&
      typeof error.response.data === "object" &&
      "errors" in error.response.data &&
      error.response.data.errors;

    const errorNames =
      hasErrorProperty(serverErrorsObject, "name") &&
      serverErrorsObject.name.join(", ");

    const errorBase =
      hasErrorProperty(serverErrorsObject, "base") &&
      serverErrorsObject.base.join(", ");

    const message =
      errorNames || errorBase || serverErrorsObject || error.message;

    // @ts-expect-error weird typing around Error class, but it's tested to work
    throw new MailtrapError(message, { cause: error });
  }

  throw error; // should not happen, but otherwise rethrow error as is
}
