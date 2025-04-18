import { Address as NodemailerAddress } from "nodemailer/lib/mailer";

import { Address } from "../types/mailtrap";

/**
 * If type of `recipient` is string, then wraps it into email object.
 * Otherwise maps into { `name`, `email` } pair.
 */
export function adaptSingleRecipient(
  recipient: string | NodemailerAddress
): Address {
  if (typeof recipient === "string") {
    return { email: recipient };
  }

  return { name: recipient.name, email: recipient.address };
}

/**
 * If there is no recipient, then returns empty array.
 * If it's not array, then adopts recipient and wraps into array.
 * Otherwise maps trough recipients and adopts each one for Mailtrap.
 */
export default function adaptRecipients(
  recipients:
    | string
    | NodemailerAddress
    | Array<string | NodemailerAddress>
    | undefined
): Address[] {
  if (!recipients) {
    return [];
  }

  if (!Array.isArray(recipients)) {
    return [adaptSingleRecipient(recipients)];
  }

  return recipients.map(adaptSingleRecipient);
}

/**
 * If there is no recipient or empty array is passed, then return undefined since it is an optional field.
 * If it's not array, then adapt recipient and returns it.
 * Otherwise, if type is array as nodemailer allows, we pick the first recipient
 * as Mailtrap doesn't support multiple reply-to recipients.
 */
export function adaptReplyToRecipient(
  recipients:
    | string
    | NodemailerAddress
    | Array<string | NodemailerAddress>
    | undefined
): Address | undefined {
  if (!recipients || (Array.isArray(recipients) && recipients.length === 0)) {
    return undefined;
  }

  if (!Array.isArray(recipients)) {
    return adaptSingleRecipient(recipients);
  }

  return adaptSingleRecipient(recipients[0]);
}
