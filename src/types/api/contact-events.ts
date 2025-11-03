export interface ContactEventOptions {
  name: string;
  params: Record<string, string | number | boolean | null>;
}

export interface ContactEventResponse {
  contact_id: string;
  contact_email: string;
  name: string;
  params: Record<string, string | number | boolean | null>;
}
