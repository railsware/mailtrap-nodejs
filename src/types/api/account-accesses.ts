export type AccountAccessFilters = {
  domainUuids?: string[];
  inboxIds?: string[];
  projectIds?: string[];
};

export type DeleteAccountAccessResponse = {
  id: number;
};
