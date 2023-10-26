import axios, { AxiosError } from "axios";

import MailtrapError from "./MailtrapError";

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

    type AxiosErrorObject = {
      name: string[];
    };

    const hasErrorNames = (obj: unknown): obj is AxiosErrorObject => {
      return (
        (obj as AxiosErrorObject)?.name !== undefined &&
        Array.isArray((obj as AxiosErrorObject).name)
      );
    };

    const errorNames = hasErrorNames(serverErrorsObject)
      ? serverErrorsObject.name
      : undefined;

    const message = errorNames ? errorNames.join(", ") : error.message;

    // @ts-expect-error weird typing around Error class, but it's tested to work
    throw new MailtrapError(message, { cause: error });
  }

  throw error; // should not happen, but otherwise rethrow error as is
}
