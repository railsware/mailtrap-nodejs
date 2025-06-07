import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  ContactList,
  ContactListOptions,
  ContactLists,
} from "../../../types/api/contactlist";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ContactListsApi {
  private client: AxiosInstance;

  private contactListsURL: string;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.contactListsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists`;
  }

  /**
   * Get all contact lists.
   */
  public async getAll() {
    const url = `${this.contactListsURL}`;

    return this.client.get<ContactLists, ContactLists>(url);
  }

  /**
   * Get a contact list by `listId`.
   */
  public async get(listId: number) {
    const url = `${this.contactListsURL}/${listId}`;

    return this.client.get<ContactList, ContactList>(url);
  }

  /**
   * Creates a new contact.
   */
  public async create(data: ContactListOptions) {
    return this.client.post<ContactList, ContactList>(
      this.contactListsURL,
      data
    );
  }

  /**
   * Updates an existing contact list by `listId`.
   */
  public async update(listId: number, data: ContactListOptions) {
    const url = `${this.contactListsURL}/${listId}`;

    return this.client.patch<ContactList, ContactList>(url, data);
  }

  /**
   * Deletes a contact list by ID.
   */
  public async delete(listId: number) {
    const url = `${this.contactListsURL}/${listId}`;

    return this.client.delete(url);
  }
}
