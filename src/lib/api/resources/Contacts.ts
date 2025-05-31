import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  Contact,
  ContactData,
  ContactUpdateData,
} from "../../../types/api/contacts";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ContactsApi {
  private client: AxiosInstance;

  private contactsURL: string;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.contactsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts`;
  }

  /**
   * Creates a new contact.
   */
  public async create(data: ContactData) {
    return this.client.post<Contact, Contact>(this.contactsURL, {
      contact: data,
    });
  }

  /**
   * Updates an existing contact.
   */
  public async update(id: number, data: ContactUpdateData) {
    const url = `${this.contactsURL}/${id}`;
    return this.client.patch<Contact, Contact>(url, { contact: data });
  }

  /**
   * Deletes a contact.
   */
  public async delete(id: number) {
    const url = `${this.contactsURL}/${id}`;
    return this.client.delete(url);
  }
}
