import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  ContactFieldOptions,
  ContactFieldResponse,
  ContactFieldsResponse,
} from "../../../types/api/contact-fields";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ContactFieldsApi {
  private client: AxiosInstance;

  private contactFieldsURL: string;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.contactFieldsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/fields`;
  }

  /**
   * Get all contact fields.
   */
  public async getList() {
    const url = `${this.contactFieldsURL}`;

    return this.client.get<ContactFieldsResponse, ContactFieldsResponse>(url);
  }

  /**
   * Get a contact field by `fieldId`.
   */
  public async get(fieldId: number) {
    const url = `${this.contactFieldsURL}/${fieldId}`;

    return this.client.get<ContactFieldResponse, ContactFieldResponse>(url);
  }

  /**
   * Creates a new contact field.
   */
  public async create(data: ContactFieldOptions) {
    return this.client.post<ContactFieldResponse, ContactFieldResponse>(
      this.contactFieldsURL,
      data
    );
  }

  /**
   * Updates an existing contact field by `fieldId`.
   */
  public async update(fieldId: number, data: ContactFieldOptions) {
    const url = `${this.contactFieldsURL}/${fieldId}`;

    return this.client.patch<ContactFieldResponse, ContactFieldResponse>(
      url,
      data
    );
  }

  /**
   * Deletes a contact field by ID.
   */
  public async delete(fieldId: number) {
    const url = `${this.contactFieldsURL}/${fieldId}`;

    return this.client.delete(url);
  }
}
