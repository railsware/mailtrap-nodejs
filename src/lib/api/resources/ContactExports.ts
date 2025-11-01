import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import {
  ContactExportResponse,
  CreateContactExportParams,
} from "../../../types/api/contact-exports";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ContactExportsApi {
  private client: AxiosInstance;

  private contactExportsURL: string;

  constructor(client: AxiosInstance, accountId: number) {
    this.client = client;
    this.contactExportsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/exports`;
  }

  /**
   * Get a contact export by `exportId`.
   */
  public async get(exportId: number) {
    const url = `${this.contactExportsURL}/${exportId}`;

    return this.client.get<ContactExportResponse, ContactExportResponse>(url);
  }

  /**
   * Export contacts.
   */
  public async create(params: CreateContactExportParams) {
    const url = `${this.contactExportsURL}`;

    return this.client.post<ContactExportResponse, ContactExportResponse>(
      url,
      params
    );
  }
}
