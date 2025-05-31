import { AxiosInstance } from "axios";

import CONFIG from "../../../config";
import {
  ContactData,
  ContactResponse,
  ContactUpdateData,
} from "../../../types/api/contacts";
import { ContactList } from "../../../types/api/contactlist";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ContactsApi {
  private client: AxiosInstance;

  private contactsURL: string;

  private contactListsURL: string;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.contactsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts`;
    this.contactListsURL = `${GENERAL_ENDPOINT}/api/accounts/${accountId}/contacts/lists`;
  }

  /**
   * Creates a new contact.
   */
  public async create(contact: ContactData) {
    return this.client.post<ContactResponse, ContactResponse>(
      this.contactsURL,
      { contact }
    );
  }

  /**
   * Updates an existing contact by ID or email.
   */
  public async update(identifier: string, contact: ContactUpdateData) {
    const url = `${this.contactsURL}/${identifier}`;
    return this.client.patch<ContactResponse, ContactResponse>(url, {
      contact,
    });
  }

  /**
   * Deletes a contact by ID or email.
   */
  public async delete(identifier: string) {
    const url = `${this.contactsURL}/${identifier}`;
    return this.client.delete<ContactResponse, ContactResponse>(url);
  }

  /**
   * Gets a list of contact lists.
   */
  public async list() {
    return this.client.get<ContactList[], ContactList[]>(this.contactListsURL);
  }
}
