export interface Contact {
  id: string;
  email: string;
  created_at: number;
  updated_at: number;
  list_ids: number[];
  status: "subscribed" | "unsubscribed";
  fields: Record<string, string>;
}

export interface ContactData {
  email: string;
  fields?: Record<string, string>;
  list_ids?: number[];
  unsubscribed?: boolean;
}

export interface ContactUpdateData extends ContactData {
  list_ids_included?: number[];
  list_ids_excluded?: number[];
}

export interface ContactResponse {
  data: Contact;
}
