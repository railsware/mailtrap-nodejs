import MailtrapClient from "./mailtrap-client";

import adaptMail from "../adapters/mail";

import CONFIG from "../config";

import { Mail as MailtrapMail } from "../types/mailtrap";
import {
  NormalizeCallbackData,
  NormalizeCallbackError,
  NormalizeCallback,
} from "../types/transport";

const { ERRORS } = CONFIG;
const { SENDING_FAILED, NO_DATA_ERROR } = ERRORS;

/**
 * Callback function for `Nodemailer.normalize` method which introduces Mailtrap integration.
 * Uses function curring to inject dependencies like `transport client` and `nodemailer default callback object`.
 */
export default function normalizeCallback(
  client: MailtrapClient,
  callback: NormalizeCallback
) {
  return (err: NormalizeCallbackError, data: NormalizeCallbackData) => {
    if (err) {
      return callback(err, { success: false, errors: [err.message] });
    }

    if (data) {
      const mail = adaptMail(data);

      if ("errors" in mail) {
        return callback(new Error(...mail.errors), {
          success: false,
          errors: mail.errors,
        });
      }

      const mailtrapClient = data.sandbox ? client.testing : client;

      return mailtrapClient
        .send(mail as MailtrapMail)
        .then((sendResponse) => callback(null, sendResponse))
        .catch((error) => {
          callback(new Error(error), {
            success: false,
            errors: [SENDING_FAILED],
          });
        });
    }

    return callback(new Error(NO_DATA_ERROR), {
      success: false,
      errors: [NO_DATA_ERROR],
    });
  };
}
