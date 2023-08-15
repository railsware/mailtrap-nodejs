import adaptAttachment from "./attachment";
import adaptContent from "./content";
import adaptHeaders from "./headers";
import adaptRecipients, { adaptSingleRecipient } from "./recipients";

import CONFIG from "../config";

import { Mail, SendError } from "../types/mailtrap";
import { MailtrapMailOptions } from "../types/transporter";

const { ERRORS } = CONFIG;
const { SUBJECT_REQUIRED, FROM_REQUIRED } = ERRORS;

/**
 * Checks if `subject` or `from` properties are missing, then returns error.
 * Then adapts `sender-receiver`, `headers`, `text`, `html` and `attachements` for Mailtrap.
 */
export default function adaptMail(data: MailtrapMailOptions): Mail | SendError {
  if (!data.subject) {
    return { success: false, errors: [SUBJECT_REQUIRED] };
  }

  if (!data.from) {
    return { success: false, errors: [FROM_REQUIRED] };
  }

  const mail: Mail = {
    subject: data.subject,
    from: adaptSingleRecipient(data.from),
    to: adaptRecipients(data.to),
    cc: adaptRecipients(data.cc),
    bcc: adaptRecipients(data.bcc),
  };

  if (data.headers) {
    mail.headers = adaptHeaders(data.headers);
  }

  if (data.text) {
    mail.text = adaptContent(data.text);
  }

  if (data.html) {
    mail.html = adaptContent(data.html);
  }

  if (data.attachments) {
    mail.attachments = data.attachments.map(adaptAttachment);
  }

  if (data.category) {
    mail.category = data.category;
  }

  if (data.customVariables) {
    mail.custom_variables = data.customVariables;
  }

  return mail;
}
