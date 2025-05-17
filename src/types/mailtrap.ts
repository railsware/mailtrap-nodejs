export type CustomVariables = Record<string, string | number | boolean>;

export type MailtrapHeaders = Record<string, string>;

export type Address = {
  name?: string;
  email: string;
};

export type Attachment = {
  filename: string;
  type?: string;
  content: string | Buffer;
  disposition?: string;
  content_id?: string;
};

export type CommonMail = {
  from: Address;
  to: Address[];
  cc?: Address[];
  bcc?: Address[];
  attachments?: Attachment[];
  headers?: MailtrapHeaders;
  custom_variables?: CustomVariables;
  reply_to?: Address;
};

export type TemplateVariables = Record<string, string | number | boolean>;

type MailFromTemplateContent = {
  template_uuid: string;
  template_variables?: TemplateVariables;
};

type TextMailContent = {
  text?: string | Buffer;
};

type HTMLMailContent = {
  html?: string | Buffer;
};

type CommonMailParams = CommonMail & {
  subject: string;
  category?: string;
};

export type MailContent = CommonMailParams &
  (TextMailContent | HTMLMailContent);

export type Mail = CommonMail & (MailContent | MailFromTemplateContent);

export type SendResponse = {
  success: true;
  message_ids: string[];
};

export type SendError = {
  success: false;
  errors: string[];
};

export type MailtrapClientConfig = {
  token: string;
  testInboxId?: number;
  accountId?: number;
  bulk?: boolean;
  sandbox?: boolean;
};

export type BatchMail = Mail[];

export type BatchSendResponse = {
  success: true;
  message_ids: string[];
};

interface BaseAddress {
  email: string;
  name?: string;
}

interface InlineBatchSendBase {
  from: BaseAddress;
  subject: string; // Required when using inline content
  text?: string | Buffer;
  html?: string | Buffer;
  attachments?: Attachment[];
  headers?: Record<string, string>;
  custom_variables?: Record<string, string>;
  category?: string;
  reply_to?: BaseAddress;
}

interface TemplateBatchSendBase {
  from: BaseAddress;
  template_uuid: string; // Required for template usage
  template_variables?: Record<string, string>;
  custom_variables?: Record<string, string>;
  category?: string;
  reply_to?: BaseAddress;
}

export interface BatchSendRequest {
  base: InlineBatchSendBase | TemplateBatchSendBase;
  requests: {
    to: BaseAddress[];
    cc?: BaseAddress[];
    bcc?: BaseAddress[];
  }[];
}
