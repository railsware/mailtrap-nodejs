export interface Contact {
  id: number;
  email: string;
  fields: Record<string, string>;
  list_ids: number[];
  unsubscribed: boolean;
  created_at: string;
  updated_at: string;
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
