import { AxiosInstance } from "axios";

import ContactsApi from "./resources/Contacts";
import ContactListsApi from "./resources/ContactLists";

export default class ContactsBaseAPI {
  private client: AxiosInstance;

  private accountId?: number;

  public contacts: ContactsApi;

  public contactLists: ContactListsApi;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId;
    this.contacts = new ContactsApi(this.client, this.accountId);
    this.contactLists = new ContactListsApi(this.client, this.accountId);
  }
}
