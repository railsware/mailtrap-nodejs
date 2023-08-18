import { Attachment as NodemailerAttachment } from "nodemailer/lib/mailer";

import CONFIG from "../config";

import { Attachment } from "../types/mailtrap";

const { ERRORS } = CONFIG;
const { FILENAME_REQUIRED, CONTENT_REQUIRED } = ERRORS;

/**
 * Adopts Nodemailer attachment to Mailtrap.
 * Checks if filename or content are missing, then rejects with error.
 * Otherwise specifies type of content, then builds attachment object for Mailtrap.
 * @todo throw error when only filename is provided
 */
export default function adaptAttachment(
  nodemailerAttachment: NodemailerAttachment
): Attachment {
  if (!nodemailerAttachment.filename) {
    throw new Error(FILENAME_REQUIRED);
  }

  if (!nodemailerAttachment.content) {
    throw new Error(CONTENT_REQUIRED);
  }

  const content =
    typeof nodemailerAttachment.content === "string" ||
    nodemailerAttachment.content instanceof Buffer
      ? nodemailerAttachment.content
      : nodemailerAttachment.content.read();

  return {
    filename: nodemailerAttachment.filename,
    content,
    disposition: nodemailerAttachment.contentDisposition,
    content_id: nodemailerAttachment.cid,
    type: nodemailerAttachment.contentType,
  };
}
