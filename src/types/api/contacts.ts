interface Contact {
  id: string;
  status: "subscribed" | "unsubscribed";
  email: string;
  fields: Record<string, string | number>;
  list_ids: number[];
  created_at: number;
  updated_at: number;
}

export interface ContactData {
  email: string;
  fields?: Record<string, string | number>;
  list_ids?: number[];
  unsubscribed?: boolean;
}

export interface ContactUpdateData extends ContactData {
  list_ids_included?: number[];
  list_ids_excluded?: number[];
}

export interface ContactResponse {
  action: "updated" | "created" | "deleted";
  data: Contact;
}

export interface CreateContactResponse {
  data: {
    id: string;
    status: "subscribed" | "unsubscribed";
    email: string;
    fields: Record<string, string>;
    list_ids: number[];
    created_at: number;
    updated_at: number;
  };
}
