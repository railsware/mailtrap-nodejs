/**
 * Contact field definition/schema used for managing field types.
 * Represents the structure and metadata of a contact field (e.g., field name, data type, merge tag).
 * Used by Contact Fields API for CRUD operations on field definitions.
 */
export interface ContactField {
  id: number;
  name: string;
  merge_tag: string;
  data_type: "text" | "number" | "boolean" | "date";
  created_at: number;
  updated_at: number;
}

export interface ContactFieldOptions {
  name?: string;
  merge_tag?: string;
  data_type?: "text" | "number" | "boolean" | "date";
}

export interface ContactFieldResponse {
  data: ContactField;
}

export interface ContactFieldsResponse {
  data: ContactField[];
}
