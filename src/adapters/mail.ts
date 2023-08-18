import adaptAttachment from "./attachement";
import adaptContent from "./content";
import adaptHeaders from "./headers";
import adaptRecipients, { adaptSingleRecipient } from "./recipients";

import CONFIG from "../config";

import { CommonMail, Mail, MailContent, SendError } from "../types/mailtrap";
import { MailtrapMailOptions } from "../types/transport";

const { ERRORS } = CONFIG;
const { SUBJECT_REQUIRED, FROM_REQUIRED } = ERRORS;

/**
 * Checks if `from` property is missing, then returns error.
 * Then gathers common data for mail, then checks if mail es template based. If it is then returns mail.
 * Otherwise checks if subject is missing (if mail is not template based, subject is must), then returns error.
 * Then returns mail with all params needed.
 */
export default function adaptMail(data: MailtrapMailOptions): Mail | SendError {
  if (!data.from) {
    return { success: false, errors: [FROM_REQUIRED] };
  }

  const mail: CommonMail = {
    from: adaptSingleRecipient(data.from),
    to: adaptRecipients(data.to),
    cc: adaptRecipients(data.cc),
    bcc: adaptRecipients(data.bcc),
  };

  if (data.headers) {
    mail.headers = adaptHeaders(data.headers);
  }

  if (data.attachments) {
    mail.attachments = data.attachments.map(adaptAttachment);
  }

  if (data.customVariables) {
    mail.custom_variables = data.customVariables;
  }

  if (data.templateUuid && data.templateVariables) {
    return {
      ...mail,
      template_uuid: data.templateUuid,
      template_variables: data.templateVariables,
    };
  }

  if (!data.subject) {
    return { success: false, errors: [SUBJECT_REQUIRED] };
  }

  const mailWithSubject: MailContent = {
    ...mail,
    subject: data.subject,
  };

  if (data.category) {
    mailWithSubject.category = data.category;
  }

  if (data.text) {
    return {
      ...mailWithSubject,
      text: adaptContent(data.text),
    };
  }

  if (data.html) {
    return {
      ...mailWithSubject,
      html: adaptContent(data.html),
    };
  }

  return mailWithSubject;
}
