export type ContactImportResponse = {
  id: number;
  status: "created" | "started" | "finished" | "failed";
  created_contacts_count?: number;
  updated_contacts_count?: number;
  contacts_over_limit_count?: number;
};

export type ImportContactsRequest = {
  contacts: {
    email: string;
    fields?: {
      first_name?: string;
      last_name?: string;
      zip_code?: number;
      [key: string]: string | number | undefined;
    };
    list_ids_included?: number[];
    list_ids_excluded?: number[];
  }[];
};
