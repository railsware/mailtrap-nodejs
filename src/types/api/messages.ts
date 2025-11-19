export type SmtpInformationData = {
  mail_from_addr: string;
  client_ip: string;
};

export type Message = {
  id: number;
  inbox_id: number;
  subject: string;
  sent_at: string;
  from_email: string;
  from_name: string;
  to_email: string;
  to_name: string;
  email_size: number;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  html_body_size: number;
  text_body_size: number;
  human_size: string;
  html_path: string;
  txt_path: string;
  raw_path: string;
  download_path: string;
  html_source_path: string;
  blacklists_report_info: boolean;
  smtp_information: {
    ok: boolean;
    data?: SmtpInformationData;
  };
};

type ReportError = {
  status: "error";
  msg: string;
};

type ReportSuccess = {
  status: "success";
  errors: string[];
};

export type Report = ReportError | ReportSuccess;

export type EmailHeaders = {
  headers: {
    date: string;
    from: string;
    to: string;
    subject: string;
    mime_version: string;
    content_type: string;
    content_transfer_encoding: string;
    bcc?: string;
  };
};

type SpamReportDetail = {
  Pts: string;
  RuleName: string;
  Description: string;
};

export type SpamReport = {
  ResponseCode: number;
  ResponseMessage: string;
  ResponseVersion: string;
  Score: number;
  Spam: boolean;
  Threshold: number;
  Details: SpamReportDetail[];
};

export type MessageUpdateParams = {
  isRead: boolean;
};

export type MessageListOptions = {
  last_id?: number;
  page?: number;
  search?: string;
};
