import NodemailerMail = require("nodemailer/lib/mailer");

import { Transporter } from "nodemailer";
import {
  SendResponse,
  SendError,
  CustomVariables,
  TemplateVariables,
} from "./mailtrap";

type AdditionalFields = {
  category?: string;
  custom_variables?: CustomVariables;
  template_uuid?: string;
  template_variables?: TemplateVariables;
};

export type NormalizeCallbackData =
  | (NodemailerMail.Options & AdditionalFields)
  | undefined;

export type NormalizeCallbackError = Error | null | undefined;

export type NormalizeCallback = (
  err: Error | null,
  info: SendResponse | SendError
) => void;

export interface MailtrapMailOptions extends NodemailerMail.Options {
  customVariables?: CustomVariables;
  category?: string;
  templateUuid?: string;
  templateVariables?: Record<string, string | number | boolean>;
}

export type MailtrapResponse = SendResponse | SendError;

export interface MailtrapTransporter extends Transporter<MailtrapResponse> {
  sendMail(
    mailOptions: MailtrapMailOptions,
    callback: (err: Error | null, info: MailtrapResponse) => void
  ): void;
  sendMail(mailOptions: MailtrapMailOptions): Promise<MailtrapResponse>;
}