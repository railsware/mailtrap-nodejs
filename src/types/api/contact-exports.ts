export interface ContactExportResponse {
  id: number;
  status: "started" | "created" | "finished";
  created_at: string;
  updated_at: string;
  url: string | null;
}

export interface CreateContactExportFilter {
  name: string; // e.g. "list_id", "subscription_status", "email"
  operator:
    | "equal"
    | "not_equal"
    | "contains"
    | "not_contains"
    | "is_empty"
    | "is_not_empty";
  value: string | number | boolean | string[] | number[];
}

export interface CreateContactExportParams {
  filters: CreateContactExportFilter[];
}
