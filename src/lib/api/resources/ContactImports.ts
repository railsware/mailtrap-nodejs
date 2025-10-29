import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import {
  ContactImportResponse,
  ImportContactsRequest,
} from "../../../types/api/contact-imports";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ContactImportsApi {
  private client: AxiosInstance;

  private contactImportsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.contactImportsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/imports`;
  }

  /**
   * Get a contact import by `importId`.
   */
  public async get(importId: number) {
    const url = `${this.contactImportsURL}/${importId}`;

    return this.client.get<ContactImportResponse, ContactImportResponse>(url);
  }

  /**
   * Import contacts.
   */
  public async create(data: ImportContactsRequest) {
    const url = `${this.contactImportsURL}`;

    return this.client.post<ContactImportResponse, ContactImportResponse>(
      url,
      data
    );
  }
}
