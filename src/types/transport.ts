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
  sandbox?: boolean | undefined;
};

export type NormalizeCallbackData =
  | (NodemailerMail.Options & AdditionalFields)
  | undefined;

export type NormalizeCallbackError = Error | null | undefined;

export type NormalizeCallback = (
  err: Error | null,
  info: SendResponse | SendError
) => void;

interface MailtrapMailOptionsSandbox extends NodemailerMail.Options {
  customVariables?: CustomVariables;
  category?: string;
  sandbox: boolean;
}

export interface MailtrapMailOptions extends NodemailerMail.Options {
  customVariables?: CustomVariables;
  category?: string;
  templateUuid?: string;
  templateVariables?: Record<string, string | number | boolean>;
  sandbox?: boolean | undefined;
}

export type MailtrapResponse = SendResponse | SendError;

export interface MailtrapTransporter extends Transporter<MailtrapResponse> {
  sendMail(
    mailOptions: MailtrapMailOptions | MailtrapMailOptionsSandbox,
    callback: (err: Error | null, info: MailtrapResponse) => void
  ): void;
  sendMail(
    mailOptions: MailtrapMailOptions | MailtrapMailOptionsSandbox
  ): Promise<MailtrapResponse>;
}
