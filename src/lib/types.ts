export type Mail = {
  subject: string;
  from: Address;
  to: Address[];
  cc?: Address[];
  bcc?: Address[];
  attachments?: Attachment[];
  headers?: Record<string, string>;
  category?: string;
  custom_variables?: Record<string, string | number | boolean>;
} & MailContent;

type TextMailContent = {
  text: string | Buffer;
};

type HTMLMailContent = {
  html: string | Buffer;
};

type MailContent = TextMailContent | HTMLMailContent;

export type Address = {
  name?: string;
  email: string;
};

export type Attachment = {
  filename: string;
  type: string;
  content: string | Buffer;
  disposition?: string;
  content_id?: string;
};

export type SendResponse = {
  success: true;
  message_ids: string[];
};

export type SendError = {
  success: false;
  error: string[];
};
