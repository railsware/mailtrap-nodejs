import { AxiosInstance } from "axios";

import ContactsApi from "./resources/Contacts";

export default class ContactsBaseAPI {
  private client: AxiosInstance;

  private accountId?: number;

  public get: ContactsApi["get"];

  public create: ContactsApi["create"];

  public update: ContactsApi["update"];

  public delete: ContactsApi["delete"];

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId;
    const contacts = new ContactsApi(this.client, this.accountId);
    this.get = contacts.get.bind(contacts);
    this.create = contacts.create.bind(contacts);
    this.update = contacts.update.bind(contacts);
    this.delete = contacts.delete.bind(contacts);
  }
}
