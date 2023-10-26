import axios, { AxiosError } from "axios";

import MailtrapError from "./MailtrapError";

import { AxiosErrorObject } from "../types/axios";

/**
 * Axios error names guard.
 */
const hasErrorNames = (obj: unknown): obj is AxiosErrorObject =>
  (obj as AxiosErrorObject)?.name !== undefined &&
  Array.isArray((obj as AxiosErrorObject).name);

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

    const errorNames = hasErrorNames(serverErrorsObject)
      ? serverErrorsObject.name.join(", ")
      : serverErrorsObject;

    const message = errorNames || error.message;

    // @ts-expect-error weird typing around Error class, but it's tested to work
    throw new MailtrapError(message, { cause: error });
  }

  throw error; // should not happen, but otherwise rethrow error as is
}
