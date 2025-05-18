export interface CreateTemplateData {
  name: string;
  subject: string;
  body_html: string;
  body_text?: string;
  category?: string;
}

export interface UpdateTemplateData {
  name?: string;
  subject?: string;
  body_html?: string;
  body_text?: string;
  category?: string;
}
