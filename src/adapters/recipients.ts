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
