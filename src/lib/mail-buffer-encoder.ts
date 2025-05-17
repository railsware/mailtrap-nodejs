import { Mail } from "../types/mailtrap";

/**
 * Checks if `mail` has `text` and it's an instance of Buffer, then converts to string.
 * If `mail` has `html` and it's an instance of `Buffer`, then converts to string.
 * If it has attachments, then converts `Buffer` content to `base64` string if needed.
 */
export default function encodeMailBuffers(mail: Partial<Mail>): Partial<Mail> {
  const preparedMail = { ...mail };

  if ("text" in preparedMail && preparedMail.text instanceof Buffer) {
    preparedMail.text = preparedMail.text.toString();
  }

  if ("html" in preparedMail && preparedMail.html instanceof Buffer) {
    preparedMail.html = preparedMail.html.toString();
  }

  if (preparedMail.attachments) {
    preparedMail.attachments = preparedMail.attachments.map((attachment) => {
      if (attachment.content instanceof Buffer) {
        return {
          ...attachment,
          content: attachment.content.toString("base64"),
        };
      }

      return attachment;
    });
  }

  return preparedMail;
}
