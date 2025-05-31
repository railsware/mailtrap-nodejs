import { AxiosInstance } from "axios";

import CONFIG from "../../../config";

import { ContactData } from "../../../types/mailtrap";

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
    return this.client.post(this.contactsURL, { contact: data });
  }

  /**
   * Updates an existing contact.
   */
  public async update(id: number, data: ContactData) {
    const url = `${this.contactsURL}/${id}`;
    return this.client.patch(url, { contact: data });
  }

  /**
   * Deletes a contact.
   */
  public async delete(id: number) {
    const url = `${this.contactsURL}/${id}`;
    return this.client.delete(url);
  }
}
