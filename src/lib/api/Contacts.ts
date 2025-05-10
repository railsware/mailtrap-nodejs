import { AxiosInstance } from "axios";

import ContactsApi from "./resources/contacts/Contacts";
import ContactListsApi from "./resources/contacts/ContactLists";

export default class ContactsAPI {
  private client: AxiosInstance;

  private accountId?: number;

  public contacts: ContactsApi;

  public contactLists: ContactListsApi;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId;
    this.contacts = new ContactsApi(this.client, this.accountId);
    this.contactLists = new ContactListsApi(this.client);
  }
}
