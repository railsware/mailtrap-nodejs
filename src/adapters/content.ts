import { readFileSync } from "node:fs";
import { Readable } from "node:stream";
import { AttachmentLike } from "nodemailer/lib/mailer";

/**
 * Checks if content type is rather string or buffer, returns content.
 * If content is Readble stream, then calls .read().
 * If content has recursive content property then calls the same function recursively.
 * Otherwise reads file.
 */
export default function adaptContent(
  content: string | Buffer | Readable | AttachmentLike
): string | Buffer {
  if (typeof content === "string" || content instanceof Buffer) {
    return content;
  }

  if (content instanceof Readable) {
    return content.read();
  }

  if (content.content) {
    return adaptContent(content.content);
  }

  return readFileSync(content.path as string);
}
